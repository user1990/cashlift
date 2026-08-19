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
	rejectUntrustedWorkspaceApiRequest,
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

	it.each(["/dashboard", "/dashboard/spend", "/api/workspace", "/api/workspace/decisions"])(
		"routes Clerk middleware for production workspace path %s",
		(pathname) => {
			expect(needsClerkMiddleware(pathname, true)).toEqual(true);
		},
	);

	it.each(["/dashboard", "/dashboard/spend", "/api/workspace", "/api/workspace/decisions"])(
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

	it.each(["/dashboard", "/dashboard/spend", "/api/workspace", "/api/workspace/decisions"])(
		"requires workspace session for %s",
		(pathname) => {
			expect(needsWorkspaceSession(pathname)).toEqual(true);
		},
	);

	it.each(["/login", "/demo/workspace", "/demo/workspace/approvals", "/api/workspaces"])(
		"does not treat %s as a workspace session path",
		(pathname) => {
			expect(needsWorkspaceSession(pathname)).toEqual(false);
		},
	);
});

describe("workspace API request guard", () => {
	it("rejects a cross-origin write before it reaches authentication", async () => {
		const response = await (proxy as unknown as (request: NextRequest) => Promise<Response>)(
			workspaceApiRequest({ origin: "https://evil.test" }),
		);

		expect(response.status).toEqual(403);
		expect(response.headers.get("Cache-Control")).toEqual("no-store");
		expect(response.headers.get("X-Frame-Options")).toEqual("DENY");
		await expect(response.json()).resolves.toEqual({
			code: "workspace_forbidden",
			error: "Workspace API request origin is not allowed.",
		});
	});

	it("rejects a write with no origin header", () => {
		const response = rejectUntrustedWorkspaceApiRequest(workspaceApiRequest({}));

		expect(response?.status).toEqual(403);
	});

	it("allows a same-origin write and a read to continue past the guard", () => {
		const sameOrigin = rejectUntrustedWorkspaceApiRequest(workspaceApiRequest({ origin: "https://cashlift.test" }));
		const forwarded = rejectUntrustedWorkspaceApiRequest(
			workspaceApiRequest({
				headers: { host: "internal.vercel.app", origin: "https://cashlift.test", "x-forwarded-host": "cashlift.test" },
			}),
		);
		const read = rejectUntrustedWorkspaceApiRequest(workspaceApiRequest({ method: "GET" }));

		expect(sameOrigin).toEqual(null);
		expect(forwarded).toEqual(null);
		expect(read).toEqual(null);
	});

	it("leaves requests outside the workspace API untouched", () => {
		const request = new NextRequest("https://cashlift.test/api/workspaces", { method: "POST" });

		expect(rejectUntrustedWorkspaceApiRequest(request)).toEqual(null);
	});
});

function workspaceApiRequest({
	headers: extraHeaders,
	method = "PATCH",
	origin,
}: {
	headers?: Record<string, string>;
	method?: string;
	origin?: string;
}) {
	const headers = new Headers({ host: "cashlift.test", ...extraHeaders });

	if (origin) {
		headers.set("origin", origin);
	}

	return new NextRequest("https://cashlift.test/api/workspace/spend-requests/request-brandforge", {
		headers,
		method,
	});
}
