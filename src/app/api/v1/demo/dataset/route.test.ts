import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("GET /api/v1/demo/dataset", () => {
	it("returns the typed read-only demo dataset with agent headers", async () => {
		const response = await GET(new Request("https://cashlift.test/api/v1/demo/dataset?scope=overview"));
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(response.headers.get("Content-Type")).toContain("application/json");
		expect(response.headers.get("RateLimit-Policy")).toBe("60;w=60");
		expect(response.headers.get("X-API-Version")).toBe("v1");
		expect(body.profile.companyId).toBe("cashlift-demo");
	});

	it("returns a structured JSON error for an invalid scope", async () => {
		const response = await GET(new Request("https://cashlift.test/api/v1/demo/dataset?scope=unknown"));

		expect(response.status).toBe(400);
		expect(response.headers.get("Content-Type")).toContain("application/problem+json");
		await expect(response.json()).resolves.toMatchObject({ code: "api_request_failed", status: 400 });
	});
});
