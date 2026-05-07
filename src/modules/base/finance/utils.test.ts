import { describe, expect, it } from "vitest";
import { mockFinancialDataset } from "./repositories/mock";
import {
	getDebtPayoffOrder,
	getEmergencyFundTarget,
	getGoalProgress,
	getSafeToSpendToday,
	getSpendingLeaks,
} from "./utils";

describe("finance calculations", () => {
	it("keeps safe-to-spend positive after obligations and goal funding", () => {
		expect(
			getSafeToSpendToday(mockFinancialDataset, new Date("2026-05-07")),
		).toBeGreaterThan(0);
	});

	it("orders avalanche debts by highest interest rate", () => {
		const debts = getDebtPayoffOrder(mockFinancialDataset.debts, "avalanche");

		expect(debts[0].label).toBe("Rewards card");
	});

	it("orders snowball debts by smallest balance", () => {
		const debts = getDebtPayoffOrder(mockFinancialDataset.debts, "snowball");

		expect(debts[0].label).toBe("Rewards card");
	});

	it("detects the largest monthly leak first", () => {
		const leaks = getSpendingLeaks(mockFinancialDataset.transactionPatterns);

		expect(leaks[0].merchant).toBe("Coffee runs");
		expect(leaks[0].monthlyLeakCents).toBeGreaterThan(
			leaks[1].monthlyLeakCents,
		);
	});

	it("calculates goal and emergency fund targets", () => {
		expect(
			getGoalProgress(mockFinancialDataset.savingsGoals[0]),
		).toBeGreaterThan(30);
		expect(getEmergencyFundTarget(400000).sixMonthsCents).toBe(2400000);
	});
});
