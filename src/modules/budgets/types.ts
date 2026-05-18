import type { MoneyCents } from "@/modules/money/types";

export type TeamBudget = {
	approvedCents: MoneyCents;
	committedCents: MoneyCents;
	id: string;
	monthlyBudgetCents: MoneyCents;
	team: string;
};
