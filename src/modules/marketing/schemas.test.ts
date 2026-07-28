import { describe, expect, it } from "vitest";
import { LEAD_CAPTURE_SCHEMA } from "./schemas";

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
