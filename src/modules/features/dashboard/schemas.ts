import { z } from "zod";

export const quickIncomeSchema = z.object({
	amount: z.number().min(1, "Enter a positive amount."),
	label: z.string().min(2, "Name the source."),
});

export type QuickIncomeForm = z.infer<typeof quickIncomeSchema>;
