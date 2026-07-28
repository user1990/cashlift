import { describe, expect, it } from "vitest";
import { SPEND_REQUEST_SCHEMA } from "./schemas";

describe("SPEND_REQUEST_SCHEMA", () => {
	it("validates text lengths with user-visible characters", () => {
		expect(
			SPEND_REQUEST_SCHEMA.safeParse({
				amount: 1,
				reason: "👍🏾👍🏾👍🏾👍🏾👍🏾👍🏾👍🏾👍🏾",
				vendor: "🇺🇸🇺🇸",
			}).success,
		).toEqual(true);

		expect(
			SPEND_REQUEST_SCHEMA.safeParse({
				amount: 1,
				reason: "👍🏾👍🏾👍🏾👍🏾👍🏾👍🏾👍🏾",
				vendor: "🇺🇸",
			}).success,
		).toEqual(false);
	});
});
