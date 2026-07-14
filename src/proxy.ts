import { clerkMiddleware } from "@clerk/nextjs/server";
import { type NextFetchEvent, type NextRequest, NextResponse } from "next/server";
import { updateSupabaseSession } from "@/services/supabase/proxy";

const CLERK_CONFIGURED = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const AUTH_PATH_PREFIXES = ["/login", "/signup"] as const;
const STATIC_MARKETING_PATH_PREFIXES = [
	"/contact",
	"/customers",
	"/demo",
	"/features",
	"/pricing",
	"/privacy",
	"/terms",
	"/use-cases",
] as const;
const WORKSPACE_SESSION_PATH_PREFIXES = ["/dashboard", "/api/workspace"] as const;
const NEXT_IMAGE_FILL_STYLE_HASH = "'sha256-ZDrxqUOB4m/L0JWL/+gS52g1CRH0l/qwMhjTw5Z/Fsc='";
const isDevelopment = () => process.env.NODE_ENV === "development";

const createSecurityPolicy = (scriptSource: string, styleSource: string) =>
	[
		"default-src 'self'",
		`script-src ${scriptSource}${isDevelopment() ? " 'unsafe-eval'" : ""}`,
		`style-src ${styleSource}`,
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
		"upgrade-insecure-requests",
	].join("; ");

export const createContentSecurityPolicy = (nonce: string) =>
	createSecurityPolicy(`'self' 'nonce-${nonce}' 'strict-dynamic'`, `'self' 'nonce-${nonce}'`);

export const createStaticContentSecurityPolicy = () => createSecurityPolicy("'self' 'unsafe-inline'", "'self'");

const usesStaticContentSecurityPolicy = (request: NextRequest) =>
	STATIC_MARKETING_PATH_PREFIXES.some((prefix) => {
		const pathname = request.nextUrl.pathname;

		return pathname === prefix || pathname.startsWith(`${prefix}/`);
	});

const createSecurityRequestHeaders = (request: NextRequest) => {
	const headers = new Headers(request.headers);

	if (usesStaticContentSecurityPolicy(request)) {
		const contentSecurityPolicy = createStaticContentSecurityPolicy();

		headers.delete("x-nonce");
		headers.set("Content-Security-Policy", contentSecurityPolicy);

		return { contentSecurityPolicy, headers };
	}

	const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
	const contentSecurityPolicy = createContentSecurityPolicy(nonce);

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

const workspaceMiddleware = clerkMiddleware(async (_auth, request) => handleSupabaseSession(request));

const needsWorkspaceSession = (request: NextRequest) =>
	WORKSPACE_SESSION_PATH_PREFIXES.some((prefix) => {
		const pathname = request.nextUrl.pathname;

		return pathname === prefix || pathname.startsWith(`${prefix}/`);
	});

export default function proxy(request: NextRequest, event: NextFetchEvent) {
	if (CLERK_CONFIGURED && needsWorkspaceSession(request)) {
		return workspaceMiddleware(request, event);
	}

	return handleSecurityHeaders(request);
}

export const config = {
	matcher: ["/((?!$|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
