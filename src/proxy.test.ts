// @vitest-environment node

import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import proxy, { config, createContentSecurityPolicy, guestRouteRedirectPath } from "./proxy";

describe("proxy security headers", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("builds a strict nonce-based content security policy", () => {
		vi.stubEnv("NODE_ENV", "development");
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
		const request = new NextRequest("https://cashlift.test/dashboard");

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
		expect(config.matcher).toEqual(["/__clerk/(.*)", "/((?!$|_next/static|_next/image|favicon.ico|.*\\..*).*)"]);
	});

	it("returns signed-in visitors to their requested dashboard route", () => {
		const request = new NextRequest(
			"https://cashlift.test/login?redirect_url=https%3A%2F%2Fcashlift.test%2Fdashboard%2Fapprovals",
		);

		expect(guestRouteRedirectPath(request)).toBe("/dashboard/approvals");
	});

	it("rejects external return URLs", () => {
		const request = new NextRequest("https://cashlift.test/login?redirect_url=https://attacker.test");

		expect(guestRouteRedirectPath(request)).toBe("/dashboard");
	});
});
