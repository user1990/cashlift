import { describe, expect, it } from "vitest";
import { TEAM_BUDGET_SCHEMA } from "./schemas";

const BUDGET_MOCK = {
	approvedCents: 80_000,
	committedCents: 100_000,
	id: "budget-1",
	monthlyBudgetCents: 120_000,
	team: "Finance",
};

describe("TEAM_BUDGET_SCHEMA", () => {
	it.each([
		[BUDGET_MOCK, true],
		[{ ...BUDGET_MOCK, approvedCents: -1 }, false],
		[{ ...BUDGET_MOCK, committedCents: 1.5 }, false],
		[{ ...BUDGET_MOCK, monthlyBudgetCents: -1 }, false],
	])("validates persisted budget values", (value, valid) => {
		expect(TEAM_BUDGET_SCHEMA.safeParse(value).success).toBe(valid);
	});
});
