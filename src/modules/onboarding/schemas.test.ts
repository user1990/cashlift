import { describe, expect, it } from "vitest";
import { workspaceSetupSchema } from "./schemas";

describe("workspaceSetupSchema", () => {
	it("accepts the minimum self-service workspace details", () => {
		expect(workspaceSetupSchema.safeParse({ industry: "agency", name: "Studio Nova" }).success).toBe(true);
	});

	it.each([
		{ industry: "agency", name: "" },
		{ industry: "retail", name: "Studio Nova" },
	])("rejects incomplete or unsupported workspace details", (values) => {
		expect(workspaceSetupSchema.safeParse(values).success).toBe(false);
	});
});
