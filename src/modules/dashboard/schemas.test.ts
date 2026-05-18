import { describe, expect, it } from "vitest";
import { spendRequestSchema } from "./schemas";

describe("spendRequestSchema", () => {
	it("validates text lengths with user-visible characters", () => {
		expect(
			spendRequestSchema.safeParse({
				amount: 1,
				reason: "👍🏾👍🏾👍🏾👍🏾👍🏾👍🏾👍🏾👍🏾",
				vendor: "🇺🇸🇺🇸",
			}).success,
		).toEqual(true);

		expect(
			spendRequestSchema.safeParse({
				amount: 1,
				reason: "👍🏾👍🏾👍🏾👍🏾👍🏾👍🏾👍🏾",
				vendor: "🇺🇸",
			}).success,
		).toEqual(false);
	});
});
