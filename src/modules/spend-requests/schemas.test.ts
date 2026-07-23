import { describe, expect, it } from "vitest";
import { spendRequestDecisionSchema, spendRequestSchema } from "./schemas";

const REQUEST_MOCK = {
	amountCents: 120_000,
	category: "software",
	id: "request-1",
	neededByDate: "2026-05-14",
	reason: "Project tooling",
	requestedDate: "2026-05-01",
	requester: "Iris",
	status: "pending",
	team: "Finance",
	vendor: "Northstar",
};

describe("spend request schemas", () => {
	it.each([
		[REQUEST_MOCK, true],
		[{ ...REQUEST_MOCK, amountCents: -1 }, false],
		[{ ...REQUEST_MOCK, neededByDate: "14/05/2026" }, false],
		[{ ...REQUEST_MOCK, requestedDate: "01/05/2026" }, false],
	])("validates persisted request values", (value, valid) => {
		expect(spendRequestSchema.safeParse(value).success).toBe(valid);
	});

	it.each([
		["approved", true],
		["rejected", true],
		["pending", false],
	])("limits decision input to final statuses", (status, valid) => {
		expect(spendRequestDecisionSchema.safeParse({ id: REQUEST_MOCK.id, status }).success).toBe(valid);
	});
});
