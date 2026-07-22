import { describe, expect, it } from "vitest";
import { teamBudgetSchema } from "./schemas";

const budget = {
	approvedCents: 80_000,
	committedCents: 100_000,
	id: "budget-1",
	monthlyBudgetCents: 120_000,
	team: "Finance",
};

describe("teamBudgetSchema", () => {
	it.each([
		[budget, true],
		[{ ...budget, approvedCents: -1 }, false],
		[{ ...budget, committedCents: 1.5 }, false],
		[{ ...budget, monthlyBudgetCents: -1 }, false],
	])("validates persisted budget values", (value, valid) => {
		expect(teamBudgetSchema.safeParse(value).success).toBe(valid);
	});
});
