import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";

vi.hoisted(() => {
	process.env.CASHLIFT_APP_MODE = "production";
	process.env.CLERK_SECRET_KEY = "sk_test_example";
	process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "pk_test_dGVzdC1jbGVyay5jbGVyay5hY2NvdW50cy5kZXYk";
});

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
		expect(policy).not.toContain("script-src 'self' 'unsafe-inline'");
		expect(policy).toContain("style-src 'self' 'nonce-test-nonce'");
		expect(policy).toContain("style-src-elem 'self' 'unsafe-inline'");
		expect(policy).toContain("style-src-attr 'unsafe-hashes' 'sha256-ZDrxqUOB4m/L0JWL/+gS52g1CRH0l/qwMhjTw5Z/Fsc='");
		expect(policy).toContain("'sha256-zlqnbDt84zf1iSefLU/ImC54isoprH/MRiVZGskwexk='");
		expect(policy).toContain("https://clerk-telemetry.com");
		expect(policy).toContain("https://*.ingest.us.sentry.io");
		expect(policy).toContain("object-src 'none'");
		expect(policy).toContain("frame-ancestors 'none'");
		expect(policy).not.toContain("upgrade-insecure-requests");
	});

	it("upgrades insecure requests in production", () => {
		vi.stubEnv("NODE_ENV", "production");

		expect(createContentSecurityPolicy("test-nonce")).toContain("upgrade-insecure-requests");
	});

	it("allows the Vercel toolbar frame only in preview deployments", () => {
		vi.stubEnv("VERCEL_ENV", "preview");

		expect(createContentSecurityPolicy("test-nonce")).toContain("frame-src 'self'");
		expect(createContentSecurityPolicy("test-nonce")).toContain("https://vercel.live");

		vi.stubEnv("VERCEL_ENV", "production");

		expect(createContentSecurityPolicy("test-nonce")).not.toContain("https://vercel.live");
	});

	it("adds browser hardening headers to the homepage", async () => {
		const request = new NextRequest("https://cashlift.test/");

		const response = await (proxy as unknown as (request: NextRequest) => Promise<Response>)(request);

		expect(response.headers.get("Content-Security-Policy")).toContain("script-src 'self' 'nonce-");
		expect(response.headers.get("Cross-Origin-Opener-Policy")).toEqual("same-origin");
		expect(response.headers.get("Cross-Origin-Resource-Policy")).toEqual("same-origin");
		expect(response.headers.get("Referrer-Policy")).toEqual("strict-origin-when-cross-origin");
		expect(response.headers.get("Permissions-Policy")).toEqual("camera=(), microphone=(), geolocation=()");
		expect(response.headers.get("X-Content-Type-Options")).toEqual("nosniff");
		expect(response.headers.get("X-Frame-Options")).toEqual("DENY");
		expect(response.headers.get("X-Permitted-Cross-Domain-Policies")).toEqual("none");
		expect(response.headers.get("Vary")).toContain("Accept");
		expect(response.headers.get("Vary")).toContain("Accept-Encoding");
	});

	it("serves the homepage as Markdown when it is preferred", async () => {
		const request = new NextRequest("https://cashlift.test/", {
			headers: { Accept: "text/markdown" },
		});

		const response = await (proxy as unknown as (request: NextRequest) => Promise<Response>)(request);

		expect(response.status).toBe(200);
		expect(response.headers.get("Content-Type")).toBe("text/markdown; charset=utf-8");
		expect(response.headers.get("Vary")).toContain("Accept");
		expect(response.headers.get("Vary")).toContain("Accept-Encoding");
		expect(await response.text()).toContain("# CashLift");
	});

	it("returns 406 for an unsupported representation", async () => {
		const request = new NextRequest("https://cashlift.test/", {
			headers: { Accept: "application/pdf" },
		});

		const response = await (proxy as unknown as (request: NextRequest) => Promise<Response>)(request);

		expect(response.status).toBe(406);
		expect(response.headers.get("Vary")).toBe("Accept, Accept-Encoding");
		expect(response.headers.get("Content-Security-Policy")).toContain("script-src 'self' 'nonce-");
		expect(response.headers.get("X-Frame-Options")).toBe("DENY");
	});

	it("passes JSON API requests through to their JSON route auth boundary", async () => {
		const request = new NextRequest("https://cashlift.test/api/workspace/dataset", {
			headers: { Accept: "application/json" },
		});

		const response = await (proxy as unknown as (request: NextRequest) => Promise<Response>)(request);

		expect(response.status).not.toBe(406);
		expect(needsClerkMiddleware("/api/workspace/dataset", true)).toBe(false);
	});

	it("returns Markdown recovery guidance for an unknown path", async () => {
		const request = new NextRequest("https://cashlift.test/not-a-real-page", {
			headers: { Accept: "text/markdown" },
		});

		const response = await (proxy as unknown as (request: NextRequest) => Promise<Response>)(request);

		expect(response.status).toBe(404);
		expect(await response.text()).toContain("/sitemap.xml");
	});

	it.each(["/login", "/login/sso-callback", "/signup", "/signup/continue"])(
		"allows opener access for Clerk popup auth on %s",
		async (pathname) => {
			const request = new NextRequest(`https://cashlift.test${pathname}`);

			const response = await (proxy as unknown as (request: NextRequest) => Promise<Response>)(request);

			expect(response.headers.get("Cross-Origin-Opener-Policy")).toEqual("same-origin-allow-popups");
		},
	);

	it("keeps prefetch and Clerk asset requests covered by the proxy matcher", () => {
		expect(config.matcher).toEqual(["/__clerk/(.*)", "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"]);
	});

	it("uses app auth URLs for Clerk middleware redirects", () => {
		expect(createClerkMiddlewareOptions()).toMatchObject({
			signInUrl: "/login",
			signUpUrl: "/signup",
		});
		expect(createClerkMiddlewareOptions()).not.toHaveProperty("secretKey");
	});

	it.each(["/dashboard", "/dashboard/spend"])(
		"routes Clerk middleware for production workspace path %s",
		(pathname) => {
			expect(needsClerkMiddleware(pathname, true)).toEqual(true);
		},
	);

	it.each(["/dashboard", "/dashboard/spend"])(
		"keeps demo workspace path %s on security-header middleware",
		(pathname) => {
			expect(needsClerkMiddleware(pathname, false)).toEqual(false);
		},
	);

	it.each(["/login", "/signup"])("routes Clerk middleware for production auth path %s", (pathname) => {
		expect(needsClerkMiddleware(pathname, true)).toEqual(true);
	});

	it("routes Clerk proxy assets through Clerk middleware in production", () => {
		expect(needsClerkMiddleware("/__clerk/clerk.browser.js", true)).toEqual(true);
	});

	it.each(["/features", "/pricing", "/demo", "/demo/workspace"])(
		"keeps public marketing path %s off Clerk middleware",
		(pathname) => {
			expect(needsClerkMiddleware(pathname, true)).toEqual(false);
		},
	);

	it.each(["/dashboard", "/dashboard/spend"])("requires workspace session for %s", (pathname) => {
		expect(needsWorkspaceSession(pathname)).toEqual(true);
	});

	it.each(["/login", "/demo/workspace", "/demo/workspace/approvals", "/api/workspaces"])(
		"does not treat %s as a workspace session path",
		(pathname) => {
			expect(needsWorkspaceSession(pathname)).toEqual(false);
		},
	);
});
