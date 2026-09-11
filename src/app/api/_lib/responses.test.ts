import { describe, expect, it } from "vitest";
import { workspaceApiJson } from "./responses";

describe("workspace API rate limits", () => {
	it("derives remaining quota and returns a structured 429 after the quota is exhausted", async () => {
		const request = () =>
			new Request("https://cashlift.test/api/v1/workspace/dataset", {
				headers: { "x-forwarded-for": "198.51.100.42" },
			});

		const firstResponse = workspaceApiJson({ ok: true }, { request: request() });
		expect(firstResponse.headers.get("RateLimit-Remaining")).toBe("59");

		for (let index = 1; index < 60; index += 1) {
			workspaceApiJson({ ok: true }, { request: request() });
		}

		const limitedResponse = workspaceApiJson({ ok: true }, { request: request() });

		expect(limitedResponse.status).toBe(429);
		expect(limitedResponse.headers.get("RateLimit-Remaining")).toBe("0");
		expect(limitedResponse.headers.get("Retry-After")).toBeTruthy();
		expect(limitedResponse.headers.get("Content-Type")).toContain("application/problem+json");
		await expect(limitedResponse.json()).resolves.toMatchObject({ code: "api_rate_limited", status: 429 });
	});
});
