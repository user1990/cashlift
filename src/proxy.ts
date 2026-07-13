import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { type NextFetchEvent, type NextRequest, NextResponse } from "next/server";
import { updateSupabaseSession } from "@/services/supabase/proxy";

const CLERK_CONFIGURED = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const CLERK_FRONTEND_API_PROXY_URL = "/__clerk";
const CLERK_SIGN_IN_URL = "/login";
const CLERK_SIGN_UP_URL = "/signup";
const AUTH_PATH_PREFIXES = ["/login", "/signup"] as const;
const NEXT_IMAGE_FILL_STYLE_HASH = "'sha256-ZDrxqUOB4m/L0JWL/+gS52g1CRH0l/qwMhjTw5Z/Fsc='";
const isDevelopment = () => process.env.NODE_ENV === "development";
const isGuestOnlyRoute = createRouteMatcher(["/login(.*)", "/signup(.*)"]);
const isWorkspaceRoute = createRouteMatcher(["/dashboard(.*)", "/api/workspace(.*)", "/onboarding(.*)"]);

export const createContentSecurityPolicy = (nonce: string) =>
	[
		"default-src 'self'",
		`script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDevelopment() ? " 'unsafe-eval'" : ""}`,
		`style-src 'self' 'nonce-${nonce}'`,
		"style-src-elem 'self' 'unsafe-inline'",
		`style-src-attr 'unsafe-hashes' ${NEXT_IMAGE_FILL_STYLE_HASH}`,
		"img-src 'self' blob: data: https:",
		"font-src 'self'",
		"connect-src 'self' https://*.clerk.accounts.dev https://*.clerk.com https://challenges.cloudflare.com https://*.supabase.co https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://*.vercel-insights.com",
		"frame-src 'self' https://*.clerk.accounts.dev https://*.clerk.com https://challenges.cloudflare.com",
		"worker-src 'self' blob:",
		"object-src 'none'",
		"base-uri 'self'",
		"form-action 'self'",
		"frame-ancestors 'none'",
		...(process.env.NODE_ENV === "production" ? ["upgrade-insecure-requests"] : []),
	].join("; ");

const createSecurityRequestHeaders = (request: NextRequest) => {
	const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
	const contentSecurityPolicy = createContentSecurityPolicy(nonce);
	const headers = new Headers(request.headers);

	headers.set("x-nonce", nonce);
	headers.set("Content-Security-Policy", contentSecurityPolicy);

	return { contentSecurityPolicy, headers };
};

const usesPopupAuthFlow = (request: NextRequest) =>
	AUTH_PATH_PREFIXES.some((prefix) => {
		const pathname = request.nextUrl.pathname;

		return pathname === prefix || pathname.startsWith(`${prefix}/`);
	});

const applySecurityResponseHeaders = (request: NextRequest, response: Response, contentSecurityPolicy: string) => {
	response.headers.set("Content-Security-Policy", contentSecurityPolicy);
	response.headers.set(
		"Cross-Origin-Opener-Policy",
		usesPopupAuthFlow(request) ? "same-origin-allow-popups" : "same-origin",
	);
	response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
	response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
	response.headers.set("X-Content-Type-Options", "nosniff");
	response.headers.set("X-Frame-Options", "DENY");
	response.headers.set("X-Permitted-Cross-Domain-Policies", "none");

	if (!isDevelopment()) {
		response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
	}

	return response;
};

const handleSecurityHeaders = (request: NextRequest) => {
	const { contentSecurityPolicy, headers } = createSecurityRequestHeaders(request);
	const response = NextResponse.next({
		request: {
			headers,
		},
	});

	return applySecurityResponseHeaders(request, response, contentSecurityPolicy);
};

const handleSupabaseSession = async (request: NextRequest) => {
	const { contentSecurityPolicy, headers } = createSecurityRequestHeaders(request);
	const response = await updateSupabaseSession(request, headers);

	return applySecurityResponseHeaders(request, response, contentSecurityPolicy);
};

const clerkSessionMiddleware = clerkMiddleware(
	async (auth, request) => {
		const session = await auth();

		if (isGuestOnlyRoute(request) && session.isAuthenticated) {
			return NextResponse.redirect(new URL(guestRouteRedirectPath(request), request.url));
		}

		if (isWorkspaceRoute(request) && !session.isAuthenticated) {
			if (request.nextUrl.pathname.startsWith("/api/")) {
				return NextResponse.json({ error: "Sign in to access this resource." }, { status: 401 });
			}

			return session.redirectToSignIn({ returnBackUrl: request.url });
		}

		return handleSupabaseSession(request);
	},
	{
		frontendApiProxy: {
			enabled: process.env.NODE_ENV === "production",
			path: CLERK_FRONTEND_API_PROXY_URL,
		},
		signInUrl: CLERK_SIGN_IN_URL,
		signUpUrl: CLERK_SIGN_UP_URL,
	},
);

export const guestRouteRedirectPath = (request: NextRequest) => {
	const redirectUrl = request.nextUrl.searchParams.get("redirect_url");

	if (!redirectUrl) {
		return "/dashboard";
	}

	try {
		const requestedUrl = new URL(redirectUrl, request.url);
		const dashboardPathRequested =
			requestedUrl.pathname === "/dashboard" || requestedUrl.pathname.startsWith("/dashboard/");

		return requestedUrl.origin === request.nextUrl.origin && dashboardPathRequested
			? `${requestedUrl.pathname}${requestedUrl.search}${requestedUrl.hash}`
			: "/dashboard";
	} catch {
		return "/dashboard";
	}
};

export default function proxy(request: NextRequest, event: NextFetchEvent) {
	if (
		CLERK_CONFIGURED &&
		(request.nextUrl.pathname.startsWith(`${CLERK_FRONTEND_API_PROXY_URL}/`) ||
			isGuestOnlyRoute(request) ||
			isWorkspaceRoute(request))
	) {
		return clerkSessionMiddleware(request, event);
	}

	return handleSecurityHeaders(request);
}

export const config = {
	matcher: ["/__clerk/(.*)", "/((?!$|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
