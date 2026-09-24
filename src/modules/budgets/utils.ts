import { getPercentage } from "@/modules/money/format";
import type { TeamBudget } from "./types";

export const getRemainingTeamBudget = ({
	committedCents,
	monthlyBudgetCents,
}: Pick<TeamBudget, "committedCents" | "monthlyBudgetCents">) => monthlyBudgetCents - committedCents;

export const getTeamBudgetUsage = (budget: TeamBudget) => {
	if (budget.monthlyBudgetCents === 0) {
		return undefined;
	}

	return (budget.committedCents / budget.monthlyBudgetCents) * 100;
};

export const getTeamBudgetUsageLabel = (usagePercent: number | undefined) => {
	if (usagePercent === undefined) {
		return "Usage unavailable";
	}

	return `${getPercentage(usagePercent)} used`;
};
