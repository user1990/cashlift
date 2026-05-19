import { clerkMiddleware } from "@clerk/nextjs/server";
import { type NextFetchEvent, type NextRequest, NextResponse } from "next/server";
import { updateSupabaseSession } from "@/services/supabase/proxy";

const CLERK_CONFIGURED = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const WORKSPACE_SESSION_PATH_PREFIXES = ["/app", "/api/workspace"] as const;
const isDevelopment = () => process.env.NODE_ENV === "development";

export const createContentSecurityPolicy = (nonce: string) =>
	[
		"default-src 'self'",
		`script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDevelopment() ? " 'unsafe-eval'" : ""}`,
		`style-src 'self' 'nonce-${nonce}'`,
		...(isDevelopment() ? ["style-src-elem 'self' 'unsafe-inline'"] : []),
		"style-src-attr 'none'",
		"img-src 'self' blob: data: https:",
		"font-src 'self'",
		"connect-src 'self' https://*.clerk.accounts.dev https://*.clerk.com https://*.supabase.co https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://*.vercel-insights.com",
		"frame-src 'self' https://*.clerk.accounts.dev https://*.clerk.com",
		"worker-src 'self' blob:",
		"object-src 'none'",
		"base-uri 'self'",
		"form-action 'self'",
		"frame-ancestors 'none'",
		"upgrade-insecure-requests",
	].join("; ");

const createSecurityRequestHeaders = (request: NextRequest) => {
	const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
	const contentSecurityPolicy = createContentSecurityPolicy(nonce);
	const headers = new Headers(request.headers);

	headers.set("x-nonce", nonce);
	headers.set("Content-Security-Policy", contentSecurityPolicy);

	return { contentSecurityPolicy, headers };
};

const applySecurityResponseHeaders = (response: Response, contentSecurityPolicy: string) => {
	response.headers.set("Content-Security-Policy", contentSecurityPolicy);
	response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
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

	return applySecurityResponseHeaders(response, contentSecurityPolicy);
};

const handleSupabaseSession = async (request: NextRequest) => {
	const { contentSecurityPolicy, headers } = createSecurityRequestHeaders(request);
	const response = await updateSupabaseSession(request, headers);

	return applySecurityResponseHeaders(response, contentSecurityPolicy);
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
	matcher: [
		{
			missing: [
				{ key: "next-router-prefetch", type: "header" },
				{ key: "purpose", type: "header", value: "prefetch" },
			],
			source: "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
		},
	],
};
