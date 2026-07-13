import { describe, expect, it } from "vitest";
import { clerkFrontendApiProxyEnabled, getClerkFrontendApiProxyUrl } from "./config";

describe("Clerk frontend API proxy configuration", () => {
	it("uses direct Clerk requests during local development", () => {
		expect(clerkFrontendApiProxyEnabled("development")).toBe(false);
		expect(getClerkFrontendApiProxyUrl("development")).toBeUndefined();
	});

	it("uses the same-origin proxy in production", () => {
		expect(clerkFrontendApiProxyEnabled("production")).toBe(true);
		expect(getClerkFrontendApiProxyUrl("production")).toBe("/__clerk");
	});
});
