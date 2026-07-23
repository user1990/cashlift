import type { TeamBudget } from "./types";

export const getRemainingTeamBudget = ({
	committedCents,
	monthlyBudgetCents,
}: Pick<TeamBudget, "committedCents" | "monthlyBudgetCents">) => monthlyBudgetCents - committedCents;

export const getTeamBudgetUsage = (budget: TeamBudget) =>
	budget.monthlyBudgetCents === 0 ? 0 : (budget.committedCents / budget.monthlyBudgetCents) * 100;
