import { describe, expect, it } from "vitest";
import { spendRequestDecisionSchema, spendRequestSchema } from "./schemas";

const request = {
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
		[request, true],
		[{ ...request, amountCents: -1 }, false],
		[{ ...request, neededByDate: "14/05/2026" }, false],
		[{ ...request, requestedDate: "01/05/2026" }, false],
	])("validates persisted request values", (value, valid) => {
		expect(spendRequestSchema.safeParse(value).success).toBe(valid);
	});

	it("limits decision input to final statuses", () => {
		expect(spendRequestDecisionSchema.safeParse({ id: request.id, status: "pending" }).success).toBe(false);
	});
});
