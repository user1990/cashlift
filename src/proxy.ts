import { clerkMiddleware } from "@clerk/nextjs/server";
import { type NextFetchEvent, type NextRequest, NextResponse } from "next/server";
import { getAgentMarkdown, NOT_FOUND_MARKDOWN } from "@/services/agent/content";
import { CLERK_SIGN_IN_URL, CLERK_SIGN_UP_URL, getRequiredClerkPublishableKey } from "@/services/clerk/config";
import { getRequiredClerkSecretKey } from "@/services/clerk/serverConfig";
import { workspaceDemoEnabled } from "@/services/env/app";
import { updateSupabaseSession } from "@/services/supabase/proxy";
import { preferredContentType } from "@/utilities/http/accept";

const AUTH_PATH_PREFIXES = ["/login", "/signup"] as const;
const CLERK_ASSET_PATH_PREFIX = "/__clerk";
const WORKSPACE_SESSION_PATH_PREFIXES = ["/dashboard", "/api/workspace"] as const;
const NEXT_IMAGE_FILL_STYLE_HASH = "'sha256-ZDrxqUOB4m/L0JWL/+gS52g1CRH0l/qwMhjTw5Z/Fsc='";
const NEXT_IMAGE_COLOR_STYLE_HASH = "'sha256-zlqnbDt84zf1iSefLU/ImC54isoprH/MRiVZGskwexk='";
const isDevelopment = () => process.env.NODE_ENV === "development";
const isVercelPreview = () => process.env.VERCEL_ENV === "preview";

const createSecurityPolicy = (scriptSource: string, styleSource: string) =>
	[
		"default-src 'self'",
		`script-src ${scriptSource}${isDevelopment() ? " 'unsafe-eval'" : ""}`,
		`style-src ${styleSource}`,
		"style-src-elem 'self' 'unsafe-inline'",
		`style-src-attr 'unsafe-hashes' ${NEXT_IMAGE_FILL_STYLE_HASH} ${NEXT_IMAGE_COLOR_STYLE_HASH}`,
		"img-src 'self' blob: data: https:",
		"font-src 'self'",
		"connect-src 'self' https://*.clerk.accounts.dev https://*.clerk.com https://clerk-telemetry.com https://challenges.cloudflare.com https://*.supabase.co https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://*.vercel-insights.com",
		`frame-src 'self' https://*.clerk.accounts.dev https://*.clerk.com https://challenges.cloudflare.com${isVercelPreview() ? " https://vercel.live" : ""}`,
		"worker-src 'self' blob:",
		"object-src 'none'",
		"base-uri 'self'",
		"form-action 'self'",
		"frame-ancestors 'none'",
		...(process.env.NODE_ENV === "production" ? ["upgrade-insecure-requests"] : []),
	].join("; ");

export const createContentSecurityPolicy = (nonce: string) =>
	createSecurityPolicy(`'self' 'nonce-${nonce}' 'strict-dynamic'`, `'self' 'nonce-${nonce}'`);

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
	response.headers.set("Cross-Origin-Resource-Policy", "same-origin");
	response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
	response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
	response.headers.set("X-Content-Type-Options", "nosniff");
	response.headers.set("X-Frame-Options", "DENY");
	response.headers.set("X-Permitted-Cross-Domain-Policies", "none");
	appendVary(response.headers, "Accept", "Accept-Encoding");
	response.headers.append("Link", '<https://cashlift.vercel.app/llms.txt>; rel="describedby"; type="text/markdown"');

	if (!isDevelopment()) {
		response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
	}

	return response;
};

const appendVary = (headers: Headers, ...values: string[]) => {
	const existing =
		headers
			.get("Vary")
			?.split(",")
			.map((value) => value.trim())
			.filter(Boolean) ?? [];
	const lowerCaseExisting = new Set(existing.map((value) => value.toLowerCase()));

	for (const value of values) {
		if (!lowerCaseExisting.has(value.toLowerCase())) {
			existing.push(value);
			lowerCaseExisting.add(value.toLowerCase());
		}
	}

	headers.set("Vary", existing.join(", "));
};

const isNextInternalRequest = (request: NextRequest) =>
	request.headers.has("RSC") ||
	request.headers.has("Next-Router-State-Tree") ||
	request.headers.has("Next-Router-Prefetch");

const handleAgentContentNegotiation = (request: NextRequest) => {
	if (isNextInternalRequest(request)) {
		return undefined;
	}

	const acceptHeader = request.headers.get("accept");
	const preferredType = preferredContentType(acceptHeader);

	if (preferredType === "text/markdown") {
		const markdown = getAgentMarkdown(request.nextUrl.pathname);
		const response = new Response(markdown ?? NOT_FOUND_MARKDOWN, {
			headers: {
				"Cache-Control": "public, max-age=300, s-maxage=3600",
				"Content-Type": "text/markdown; charset=utf-8",
			},
			status: markdown ? 200 : 404,
		});

		const { contentSecurityPolicy } = createSecurityRequestHeaders(request);
		applySecurityResponseHeaders(request, response, contentSecurityPolicy);

		return response;
	}

	if (preferredType === null && acceptHeader) {
		return new Response("Not Acceptable\n\nAvailable: text/html, text/markdown\n", {
			headers: {
				"Content-Type": "text/plain; charset=utf-8",
				Vary: "Accept, Accept-Encoding",
			},
			status: 406,
		});
	}

	return undefined;
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

export const createClerkMiddlewareOptions = () => {
	getRequiredClerkSecretKey();

	return {
		publishableKey: getRequiredClerkPublishableKey(),
		signInUrl: CLERK_SIGN_IN_URL,
		signUpUrl: CLERK_SIGN_UP_URL,
	};
};

const clerkSessionMiddleware = clerkMiddleware(async (auth, request) => {
	if (needsWorkspaceSession(request.nextUrl.pathname)) {
		await auth.protect();

		return handleSupabaseSession(request);
	}

	return handleSecurityHeaders(request);
}, createClerkMiddlewareOptions);

const matchesPathPrefix = (pathname: string, prefix: string) =>
	pathname === prefix || pathname.startsWith(`${prefix}/`);

export const needsWorkspaceSession = (pathname: string) =>
	WORKSPACE_SESSION_PATH_PREFIXES.some((prefix) => matchesPathPrefix(pathname, prefix));

export const needsClerkMiddleware = (pathname: string, workspaceAuthEnabled = !workspaceDemoEnabled()) =>
	workspaceAuthEnabled &&
	(matchesPathPrefix(pathname, CLERK_ASSET_PATH_PREFIX) ||
		AUTH_PATH_PREFIXES.some((prefix) => matchesPathPrefix(pathname, prefix)) ||
		needsWorkspaceSession(pathname));

export default function proxy(request: NextRequest, event: NextFetchEvent) {
	const agentResponse = handleAgentContentNegotiation(request);

	if (agentResponse) {
		return agentResponse;
	}

	if (needsClerkMiddleware(request.nextUrl.pathname)) {
		return clerkSessionMiddleware(request, event);
	}

	return handleSecurityHeaders(request);
}

export const config = {
	matcher: ["/__clerk/(.*)", "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
