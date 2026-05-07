import { describe, expect, it } from "vitest";
import { mockFinancialDataset } from "@/modules/base/finance/repositories/mock";
import { buildDashboardViewModel } from "./view-model";

describe("dashboard view model", () => {
	it("builds deterministic derived metrics for a selected date", () => {
		const dashboard = buildDashboardViewModel({
			dataset: mockFinancialDataset,
			date: new Date("2026-05-07"),
			debtStrategy: "avalanche",
		});

		expect(dashboard.safeToSpend).toBeGreaterThan(0);
		expect(dashboard.monthlyIncome).toBeGreaterThan(
			dashboard.monthlyObligations,
		);
		expect(dashboard.firstDebt?.label).toBe("Rewards card");
		expect(dashboard.netWorthChartData).toHaveLength(
			mockFinancialDataset.netWorthSnapshots.length,
		);
		expect(dashboard.leakChartData).toHaveLength(
			mockFinancialDataset.transactionPatterns.length,
		);
		expect(dashboard.dailyChallenge?.id).toBe("challenge-cancel");
	});

	it("returns safe defaults when optional sections are empty", () => {
		const dashboard = buildDashboardViewModel({
			dataset: {
				...mockFinancialDataset,
				dailyChallenges: [],
				debts: [],
				netWorthSnapshots: [],
				savingsGoals: [],
				subscriptions: [],
				transactionPatterns: [],
			},
			date: new Date("2026-05-07"),
			debtStrategy: "snowball",
		});

		expect(dashboard.dailyChallenge).toBeNull();
		expect(dashboard.firstDebt).toBeUndefined();
		expect(dashboard.firstGoal).toBeUndefined();
		expect(dashboard.leakChartData).toEqual([]);
		expect(dashboard.netWorthChartData).toEqual([]);
		expect(dashboard.spendingLeaks).toEqual([]);
		expect(dashboard.upcomingBills).toHaveLength(
			mockFinancialDataset.bills.length,
		);
	});
});
