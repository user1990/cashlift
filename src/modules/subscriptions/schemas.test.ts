import { describe, expect, it } from "vitest";
import { subscriptionSchema } from "./schemas";

const subscription = {
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
		[subscription, true],
		[{ ...subscription, amountCents: -1 }, false],
		[{ ...subscription, amountCents: 1.5 }, false],
		[{ ...subscription, renewalDate: "14/05/2026" }, false],
		[{ ...subscription, usagePercent: -1 }, false],
		[{ ...subscription, usagePercent: 101 }, false],
	])("validates persisted subscription values", (value, valid) => {
		expect(subscriptionSchema.safeParse(value).success).toBe(valid);
	});
});
