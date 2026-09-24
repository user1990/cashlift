import { describe, expect, it } from "vitest";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { getRemainingTeamBudget, getTeamBudgetUsage } from "./utils";

describe("budget utils", () => {
	it("calculates team budget remaining", () => {
		expect(getRemainingTeamBudget(financialDatasetFixture.teamBudgets[0])).toEqual(940_000);
	});

	it("preserves over-budget and zero-budget semantics", () => {
		expect(getRemainingTeamBudget({ committedCents: 120_000, monthlyBudgetCents: 100_000 })).toEqual(-20_000);
		expect(
			getTeamBudgetUsage({ ...financialDatasetFixture.teamBudgets[0], committedCents: 1, monthlyBudgetCents: 0 }),
		).toEqual(0);
	});
});
