import {
	differenceInCalendarDays,
	differenceInCalendarWeeks,
	parseISO,
} from "date-fns";
import type {
	Bill,
	Debt,
	FinancialDataset,
	Frequency,
	MoneyCents,
	NetWorthSnapshot,
	SavingsGoal,
	Subscription,
	TransactionPattern,
} from "./types";

const frequencyMultipliers: Record<Frequency, number> = {
	annual: 1 / 12,
	biweekly: 26 / 12,
	monthly: 1,
	quarterly: 1 / 3,
	weekly: 52 / 12,
};

export function monthlyAmount(amountCents: MoneyCents, frequency: Frequency) {
	return Math.round(amountCents * frequencyMultipliers[frequency]);
}

export function getMonthlyIncome(dataset: FinancialDataset) {
	return dataset.incomeSources.reduce(
		(total, source) =>
			total + monthlyAmount(source.amountCents, source.frequency),
		0,
	);
}

export function getMonthlyObligations(dataset: FinancialDataset) {
	const bills = dataset.bills.reduce(
		(total, bill) => total + bill.amountCents,
		0,
	);
	const subscriptions = dataset.subscriptions.reduce(
		(total, subscription) => total + subscription.amountCents,
		0,
	);
	const debtMinimums = dataset.debts.reduce(
		(total, debt) => total + debt.minimumPaymentCents,
		0,
	);

	return bills + subscriptions + debtMinimums;
}

export function getSafeToSpendToday(
	dataset: FinancialDataset,
	date = new Date(),
) {
	const monthlyIncome = getMonthlyIncome(dataset);
	const monthlyObligations = getMonthlyObligations(dataset);
	const savingsCommitments = dataset.savingsGoals.reduce(
		(total, goal) => total + getSuggestedMonthlyContribution(goal, date),
		0,
	);
	const discretionaryMonthly = Math.max(
		0,
		monthlyIncome - monthlyObligations - savingsCommitments,
	);

	return Math.floor(discretionaryMonthly / 30);
}

export function getUpcomingBills(
	bills: Bill[],
	subscriptions: Subscription[],
	date = new Date(),
) {
	return [...bills, ...subscriptions]
		.map((item) => ({
			...item,
			daysUntilDue: differenceInCalendarDays(parseISO(item.dueDate), date),
		}))
		.filter((item) => item.daysUntilDue >= 0)
		.sort((left, right) => left.daysUntilDue - right.daysUntilDue)
		.slice(0, 6);
}

export function getUnusedSubscriptionSavings(subscriptions: Subscription[]) {
	return subscriptions
		.filter((subscription) => subscription.status === "unused")
		.reduce((total, subscription) => total + subscription.amountCents, 0);
}

export function getSuggestedMonthlyContribution(
	goal: SavingsGoal,
	date = new Date(),
) {
	const remaining = Math.max(0, goal.targetCents - goal.currentCents);
	const weeks = Math.max(
		1,
		differenceInCalendarWeeks(parseISO(goal.deadline), date),
	);
	const months = Math.max(1, weeks / 4.345);

	return Math.ceil(remaining / months);
}

export function getGoalProgress(goal: SavingsGoal) {
	if (goal.targetCents === 0) {
		return 0;
	}

	return Math.min(100, (goal.currentCents / goal.targetCents) * 100);
}

export function getDebtPayoffOrder(
	debts: Debt[],
	strategy: "snowball" | "avalanche",
) {
	return [...debts].sort((left, right) => {
		if (strategy === "snowball") {
			return left.balanceCents - right.balanceCents;
		}

		return right.interestRate - left.interestRate;
	});
}

export function getSpendingLeaks(patterns: TransactionPattern[]) {
	return [...patterns]
		.map((pattern) => ({
			...pattern,
			monthlyLeakCents: Math.round(
				pattern.averageAmountCents *
					pattern.monthlyOccurrences *
					(pattern.avoidableScore / 100),
			),
		}))
		.sort((left, right) => right.monthlyLeakCents - left.monthlyLeakCents);
}

export function getEmergencyFundTarget(
	monthlyEssentialExpensesCents: MoneyCents,
) {
	return {
		sixMonthsCents: monthlyEssentialExpensesCents * 6,
		threeMonthsCents: monthlyEssentialExpensesCents * 3,
	};
}

export function getNetWorth(snapshot: NetWorthSnapshot) {
	return snapshot.assetsCents - snapshot.liabilitiesCents;
}

export function getNetWorthDirection(snapshots: NetWorthSnapshot[]) {
	const sorted = [...snapshots].sort(
		(left, right) =>
			parseISO(left.weekStart).getTime() - parseISO(right.weekStart).getTime(),
	);
	const latest = sorted.at(-1);
	const previous = sorted.at(-2);

	if (!latest || !previous) {
		return { changeCents: 0, currentCents: latest ? getNetWorth(latest) : 0 };
	}

	const currentCents = getNetWorth(latest);
	return {
		changeCents: currentCents - getNetWorth(previous),
		currentCents,
	};
}
