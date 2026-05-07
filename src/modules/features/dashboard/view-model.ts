import type { FinancialDataset } from "@/modules/base/finance/types";
import {
	getDebtPayoffOrder,
	getEmergencyFundTarget,
	getMonthlyIncome,
	getMonthlyObligations,
	getNetWorth,
	getNetWorthDirection,
	getSafeToSpendToday,
	getSpendingLeaks,
	getUnusedSubscriptionSavings,
	getUpcomingBills,
} from "@/modules/base/finance/utils";
import { centsToDollars } from "@/modules/common/money/format";
import type { DebtStrategy } from "./types";

type BuildDashboardViewModelParams = {
	dataset: FinancialDataset;
	debtStrategy: DebtStrategy;
	date?: Date;
};

export const buildDashboardViewModel = ({
	dataset,
	debtStrategy,
	date = new Date(),
}: BuildDashboardViewModelParams) => {
	const safeToSpend = getSafeToSpendToday(dataset, date);
	const monthlyIncome = getMonthlyIncome(dataset);
	const monthlyObligations = getMonthlyObligations(dataset);
	const upcomingBills = getUpcomingBills(
		dataset.bills,
		dataset.subscriptions,
		date,
	);
	const unusedSubscriptionSavings = getUnusedSubscriptionSavings(
		dataset.subscriptions,
	);
	const spendingLeaks = getSpendingLeaks(dataset.transactionPatterns);
	const payoffOrder = getDebtPayoffOrder(dataset.debts, debtStrategy);
	const emergencyFundTarget = getEmergencyFundTarget(
		dataset.profile.monthlyEssentialExpensesCents,
	);
	const netWorthDirection = getNetWorthDirection(dataset.netWorthSnapshots);
	const dailyChallengeIndex =
		dataset.dailyChallenges.length > 0
			? date.getDate() % dataset.dailyChallenges.length
			: -1;
	const dailyChallenge =
		dailyChallengeIndex >= 0
			? dataset.dailyChallenges[dailyChallengeIndex]
			: null;
	const firstGoal = dataset.savingsGoals[0];
	const firstDebt = payoffOrder[0];
	const emergencyProgress =
		emergencyFundTarget.sixMonthsCents > 0
			? (dataset.profile.currentEmergencyFundCents /
					emergencyFundTarget.sixMonthsCents) *
				100
			: 0;
	const netWorthChartData = dataset.netWorthSnapshots.map((snapshot) => ({
		netWorth: centsToDollars(getNetWorth(snapshot)),
		week: snapshot.weekStart.slice(5),
	}));
	const leakChartData = spendingLeaks.map((leak) => ({
		leak: centsToDollars(leak.monthlyLeakCents),
		merchant: leak.merchant.replace(" ", "\n"),
	}));

	return {
		dailyChallenge,
		emergencyFundTarget,
		emergencyProgress,
		firstDebt,
		firstGoal,
		leakChartData,
		monthlyIncome,
		monthlyObligations,
		netWorthChartData,
		netWorthDirection,
		payoffOrder,
		safeToSpend,
		spendingLeaks,
		unusedSubscriptionSavings,
		upcomingBills,
	};
};
