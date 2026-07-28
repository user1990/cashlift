import { z } from "zod";
import { MONEY_CENTS_SCHEMA } from "@/modules/money/schemas";

export const TEAM_BUDGET_SCHEMA = z.object({
	approvedCents: MONEY_CENTS_SCHEMA.nonnegative(),
	committedCents: MONEY_CENTS_SCHEMA.nonnegative(),
	id: z.string(),
	monthlyBudgetCents: MONEY_CENTS_SCHEMA.nonnegative(),
	team: z.string(),
});
