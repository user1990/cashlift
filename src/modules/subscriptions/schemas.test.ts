import { describe, expect, it } from "vitest";
import { subscriptionSchema } from "./schemas";

const SUBSCRIPTION_MOCK = {
	amountCents: 120_000,
	id: "subscription-1",
	owner: "Iris",
	renewalDate: "2026-05-14",
	status: "active",
	usagePercent: 62,
	vendor: "Northstar",
};

describe("subscriptionSchema", () => {
	it.each([
		[SUBSCRIPTION_MOCK, true],
		[{ ...SUBSCRIPTION_MOCK, amountCents: -1 }, false],
		[{ ...SUBSCRIPTION_MOCK, amountCents: 1.5 }, false],
		[{ ...SUBSCRIPTION_MOCK, renewalDate: "14/05/2026" }, false],
		[{ ...SUBSCRIPTION_MOCK, usagePercent: -1 }, false],
		[{ ...SUBSCRIPTION_MOCK, usagePercent: 62.5 }, false],
		[{ ...SUBSCRIPTION_MOCK, usagePercent: 101 }, false],
	])("validates persisted subscription values", (value, valid) => {
		expect(subscriptionSchema.safeParse(value).success).toBe(valid);
	});
});
