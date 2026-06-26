import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import proxy, { createContentSecurityPolicy } from "./proxy";

describe("proxy security headers", () => {
	it("builds a strict nonce-based content security policy", () => {
		const policy = createContentSecurityPolicy("test-nonce");

		expect(policy).toContain("default-src 'self'");
		expect(policy).toContain("script-src 'self' 'nonce-test-nonce' 'strict-dynamic'");
		expect(policy).toContain("style-src 'self' 'nonce-test-nonce'");
		expect(policy).toContain("style-src-elem 'self' 'unsafe-inline'");
		expect(policy).toContain("style-src-attr 'none'");
		expect(policy).toContain("https://*.ingest.us.sentry.io");
		expect(policy).toContain("object-src 'none'");
		expect(policy).toContain("frame-ancestors 'none'");
	});

	it("adds browser hardening headers to matched requests", async () => {
		const request = new NextRequest("https://cashlift.test/dashboard");

		const response = await (proxy as unknown as (request: NextRequest) => Promise<Response>)(request);

		expect(response.headers.get("Content-Security-Policy")).toContain("script-src 'self' 'nonce-");
		expect(response.headers.get("Referrer-Policy")).toEqual("strict-origin-when-cross-origin");
		expect(response.headers.get("Permissions-Policy")).toEqual("camera=(), microphone=(), geolocation=()");
		expect(response.headers.get("X-Content-Type-Options")).toEqual("nosniff");
		expect(response.headers.get("X-Frame-Options")).toEqual("DENY");
		expect(response.headers.get("X-Permitted-Cross-Domain-Policies")).toEqual("none");
	});
});
