import { describe, expect, it } from "vitest";
import { CASH_ACTION_SCHEMA } from "./schemas";

const ACTION_MOCK = {
	description: "Collect the overdue invoice.",
	dueDate: "2026-05-14",
	id: "action-1",
	impactCents: 120_000,
	owner: "Iris",
	priority: "high",
	status: "open",
	title: "Collect invoice",
	type: "collection",
	visibleTo: ["owner-finance"],
};

describe("CASH_ACTION_SCHEMA", () => {
	it.each([
		[ACTION_MOCK, true],
		[{ ...ACTION_MOCK, dueDate: "14/05/2026" }, false],
		[{ ...ACTION_MOCK, impactCents: -1 }, false],
		[{ ...ACTION_MOCK, impactCents: 1.5 }, false],
	])("validates persisted action values", (value, valid) => {
		expect(CASH_ACTION_SCHEMA.safeParse(value).success).toBe(valid);
	});
});
