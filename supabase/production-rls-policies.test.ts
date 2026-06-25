import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("production Supabase policies", () => {
	it("do not grant anonymous demo access", () => {
		const productionPolicies = readFileSync("supabase/production-rls-policies.sql", "utf8");

		expect(productionPolicies).not.toMatch(/\bto\s+anon\b/i);
		expect(productionPolicies).not.toMatch(/Allow demo/i);
	});
});
