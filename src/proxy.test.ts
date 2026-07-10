import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";
import { CLERK_FRONTEND_API_PROXY_URL } from "@/services/clerk/config";
import proxy, {
	config,
	createClerkMiddlewareOptions,
	createContentSecurityPolicy,
	needsClerkMiddleware,
	needsWorkspaceSession,
} from "./proxy";

describe("proxy security headers", () => {
	it("builds a strict nonce-based content security policy", () => {
		const policy = createContentSecurityPolicy("test-nonce");

		expect(policy).toContain("default-src 'self'");
		expect(policy).toContain("script-src 'self' 'nonce-test-nonce' 'strict-dynamic'");
		expect(policy).toContain("style-src 'self' 'nonce-test-nonce'");
		expect(policy).toContain("style-src-elem 'self' 'unsafe-inline'");
		expect(policy).toContain("style-src-attr 'unsafe-hashes' 'sha256-ZDrxqUOB4m/L0JWL/+gS52g1CRH0l/qwMhjTw5Z/Fsc='");
		expect(policy).toContain("https://*.ingest.us.sentry.io");
		expect(policy).toContain("object-src 'none'");
		expect(policy).toContain("frame-ancestors 'none'");
		expect(policy).not.toContain("upgrade-insecure-requests");
	});

	it("upgrades insecure requests in production", () => {
		vi.stubEnv("NODE_ENV", "production");

		expect(createContentSecurityPolicy("test-nonce")).toContain("upgrade-insecure-requests");
	});

	it("adds browser hardening headers to matched requests", async () => {
		const request = new NextRequest("https://cashlift.test/features");

		const response = await (proxy as unknown as (request: NextRequest) => Promise<Response>)(request);

		expect(response.headers.get("Content-Security-Policy")).toContain("script-src 'self' 'nonce-");
		expect(response.headers.get("Cross-Origin-Opener-Policy")).toEqual("same-origin");
		expect(response.headers.get("Referrer-Policy")).toEqual("strict-origin-when-cross-origin");
		expect(response.headers.get("Permissions-Policy")).toEqual("camera=(), microphone=(), geolocation=()");
		expect(response.headers.get("X-Content-Type-Options")).toEqual("nosniff");
		expect(response.headers.get("X-Frame-Options")).toEqual("DENY");
		expect(response.headers.get("X-Permitted-Cross-Domain-Policies")).toEqual("none");
	});

	it.each([
		"/login",
		"/login/sso-callback",
		"/signup",
		"/signup/continue",
	])("allows opener access for Clerk popup auth on %s", async (pathname) => {
		const request = new NextRequest(`https://cashlift.test${pathname}`);

		const response = await (proxy as unknown as (request: NextRequest) => Promise<Response>)(request);

		expect(response.headers.get("Cross-Origin-Opener-Policy")).toEqual("same-origin-allow-popups");
	});

	it("keeps prefetch requests covered by the proxy matcher", () => {
		expect(config.matcher).toEqual([
			`${CLERK_FRONTEND_API_PROXY_URL}/(.*)`,
			"/((?!$|_next/static|_next/image|favicon.ico|.*\\..*).*)",
		]);
	});

	it("uses app auth URLs for Clerk middleware redirects", () => {
		vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "pk_test_example");
		vi.stubEnv("CLERK_SECRET_KEY", "sk_test_example");

		expect(createClerkMiddlewareOptions()).toMatchObject({
			frontendApiProxy: {
				enabled: false,
				path: "/__clerk",
			},
			signInUrl: "/login",
			signUpUrl: "/signup",
		});
		expect(createClerkMiddlewareOptions()).not.toHaveProperty("secretKey");
	});

	it("enables Clerk frontend API proxy in production", () => {
		vi.stubEnv("NODE_ENV", "production");
		vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "pk_live_example");
		vi.stubEnv("CLERK_SECRET_KEY", "sk_live_example");

		expect(createClerkMiddlewareOptions()).toMatchObject({
			frontendApiProxy: {
				enabled: true,
				path: "/__clerk",
			},
		});
	});

	it.each([
		"/__clerk/npm/@clerk/clerk-js@6/dist/clerk.browser.js",
		"/__clerk/npm/@clerk/ui@1/dist/ui.browser.js",
	])("always routes Clerk frontend proxy middleware for %s", (pathname) => {
		expect(needsClerkMiddleware(pathname)).toEqual(true);
	});

	it.each([
		"/dashboard",
		"/dashboard/spend",
		"/api/workspace",
		"/api/workspace/decisions",
	])("routes Clerk middleware for production workspace path %s", (pathname) => {
		expect(needsClerkMiddleware(pathname, true)).toEqual(true);
	});

	it.each([
		"/dashboard",
		"/dashboard/spend",
		"/api/workspace",
		"/api/workspace/decisions",
	])("keeps demo workspace path %s on security-header middleware", (pathname) => {
		expect(needsClerkMiddleware(pathname, false)).toEqual(false);
	});

	it.each([
		"/login",
		"/signup",
		"/features",
		"/pricing",
		"/demo",
	])("keeps marketing path %s on security-header middleware", (pathname) => {
		expect(needsClerkMiddleware(pathname)).toEqual(false);
	});

	it.each([
		"/dashboard",
		"/dashboard/spend",
		"/api/workspace",
		"/api/workspace/decisions",
	])("requires workspace session for %s", (pathname) => {
		expect(needsWorkspaceSession(pathname)).toEqual(true);
	});

	it.each([
		"/__clerk/npm/@clerk/clerk-js@6/dist/clerk.browser.js",
		"/login",
		"/api/workspaces",
	])("does not treat %s as a workspace session path", (pathname) => {
		expect(needsWorkspaceSession(pathname)).toEqual(false);
	});
});
