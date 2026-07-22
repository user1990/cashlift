import { z } from "zod";
import { moneyCentsSchema } from "@/modules/money/schemas";

export const teamBudgetSchema = z.object({
	approvedCents: moneyCentsSchema.nonnegative(),
	committedCents: moneyCentsSchema.nonnegative(),
	id: z.string(),
	monthlyBudgetCents: moneyCentsSchema.nonnegative(),
	team: z.string(),
});
