import { describe, expect, it } from "vitest";
import { HELP_FAQ_QUERY_SCHEMA, LEAD_CAPTURE_SCHEMA } from "./schemas";

describe("LEAD_CAPTURE_SCHEMA", () => {
	it("validates name and company lengths with user-visible characters", () => {
		expect(
			LEAD_CAPTURE_SCHEMA.safeParse({
				company: "👨‍👩‍👧👨‍👩‍👧",
				email: "finance@cashlift.test",
				name: "👍🏾👍🏾",
			}).success,
		).toEqual(true);

		expect(
			LEAD_CAPTURE_SCHEMA.safeParse({
				company: "👨‍👩‍👧",
				email: "finance@cashlift.test",
				name: "👍🏾",
			}).success,
		).toEqual(false);
	});
});

describe("HELP_FAQ_QUERY_SCHEMA", () => {
	it("accepts queries within the character limit", () => {
		expect(HELP_FAQ_QUERY_SCHEMA.safeParse("demo").success).toEqual(true);
		expect(HELP_FAQ_QUERY_SCHEMA.safeParse("x".repeat(121)).success).toEqual(false);
	});
});
