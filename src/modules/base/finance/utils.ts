import {
	differenceInCalendarDays,
	differenceInCalendarWeeks,
	parseISO,
} from "date-fns";
import type { MoneyCents } from "@/modules/common/money/types";
import type { DebtPayoffStrategy, FinancialDataset } from "./types";

type Bill = FinancialDataset["bills"][number];
type Subscription = FinancialDataset["subscriptions"][number];
type Debt = FinancialDataset["debts"][number];
type SavingsGoal = FinancialDataset["savingsGoals"][number];
type TransactionPattern = FinancialDataset["transactionPatterns"][number];
type NetWorthSnapshot = FinancialDataset["netWorthSnapshots"][number];
type Frequency = FinancialDataset["incomeSources"][number]["frequency"];

const frequencyMultipliers: Record<Frequency, number> = {
	annual: 1 / 12,
	biweekly: 26 / 12,
	monthly: 1,
	quarterly: 1 / 3,
	weekly: 52 / 12,
};

const monthlyAmount = (amountCents: MoneyCents, frequency: Frequency) =>
	Math.round(amountCents * frequencyMultipliers[frequency]);

export const getMonthlyIncome = (dataset: FinancialDataset) =>
	dataset.incomeSources.reduce(
		(total, source) =>
			total + monthlyAmount(source.amountCents, source.frequency),
		0,
	);

export const getMonthlyObligations = (dataset: FinancialDataset) =>
	dataset.bills.reduce((total, bill) => total + bill.amountCents, 0) +
	dataset.subscriptions.reduce(
		(total, subscription) => total + subscription.amountCents,
		0,
	) +
	dataset.debts.reduce((total, debt) => total + debt.minimumPaymentCents, 0);

export const getSafeToSpendToday = (
	dataset: FinancialDataset,
	date = new Date(),
) =>
	Math.floor(
		Math.max(
			0,
			getMonthlyIncome(dataset) -
				getMonthlyObligations(dataset) -
				dataset.savingsGoals.reduce(
					(total, goal) => total + getSuggestedMonthlyContribution(goal, date),
					0,
				),
		) / 30,
	);

export const getUpcomingBills = (
	bills: Bill[],
	subscriptions: Subscription[],
	date = new Date(),
) => {
	const upcoming: Array<(Bill | Subscription) & { daysUntilDue: number }> = [];
	for (const item of [...bills, ...subscriptions]) {
		const daysUntilDue = differenceInCalendarDays(parseISO(item.dueDate), date);
		if (daysUntilDue >= 0) {
			upcoming.push({ ...item, daysUntilDue });
		}
	}
	return upcoming
		.toSorted((left, right) => left.daysUntilDue - right.daysUntilDue)
		.slice(0, 6);
};

export const getUnusedSubscriptionSavings = (subscriptions: Subscription[]) =>
	subscriptions
		.filter((subscription) => subscription.status === "unused")
		.reduce((total, subscription) => total + subscription.amountCents, 0);

export const getSuggestedMonthlyContribution = (
	goal: SavingsGoal,
	date = new Date(),
) =>
	Math.ceil(
		Math.max(0, goal.targetCents - goal.currentCents) /
			Math.max(
				1,
				Math.max(1, differenceInCalendarWeeks(parseISO(goal.deadline), date)) /
					4.345,
			),
	);

export const getGoalProgress = (goal: SavingsGoal) =>
	goal.targetCents === 0
		? 0
		: Math.min(100, (goal.currentCents / goal.targetCents) * 100);

export const getDebtPayoffOrder = (
	debts: Debt[],
	strategy: DebtPayoffStrategy,
) =>
	debts.toSorted((left, right) =>
		strategy === "snowball"
			? left.balanceCents - right.balanceCents
			: right.interestRate - left.interestRate,
	);

export const getSpendingLeaks = (patterns: TransactionPattern[]) =>
	[...patterns]
		.map((pattern) => ({
			...pattern,
			monthlyLeakCents: Math.round(
				pattern.averageAmountCents *
					pattern.monthlyOccurrences *
					(pattern.avoidableScore / 100),
			),
		}))
		.sort((left, right) => right.monthlyLeakCents - left.monthlyLeakCents);

export const getEmergencyFundTarget = (
	monthlyEssentialExpensesCents: MoneyCents,
) => ({
	sixMonthsCents: monthlyEssentialExpensesCents * 6,
	threeMonthsCents: monthlyEssentialExpensesCents * 3,
});

export const getNetWorth = (snapshot: NetWorthSnapshot) =>
	snapshot.assetsCents - snapshot.liabilitiesCents;

export const getNetWorthDirection = (snapshots: NetWorthSnapshot[]) => {
	const sorted = snapshots.toSorted(
		(left, right) =>
			parseISO(left.weekStart).getTime() - parseISO(right.weekStart).getTime(),
	);
	const latest = sorted.at(-1);
	const previous = sorted.at(-2);

	return !latest || !previous
		? { changeCents: 0, currentCents: latest ? getNetWorth(latest) : 0 }
		: {
				changeCents: getNetWorth(latest) - getNetWorth(previous),
				currentCents: getNetWorth(latest),
			};
};
