import { z } from "zod";
import { moneyCentsSchema } from "@/modules/money/schemas";

export const teamBudgetSchema = z.object({
	approvedCents: moneyCentsSchema,
	committedCents: moneyCentsSchema,
	id: z.string(),
	monthlyBudgetCents: moneyCentsSchema,
	team: z.string(),
});
