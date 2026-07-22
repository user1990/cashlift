import { z } from "zod";
import { moneyCentsSchema } from "@/modules/money/schemas";

export const invoiceStatusSchema = z.enum(["sent", "overdue", "promised", "paid"]);

export const invoiceSchema = z.object({
	amountCents: moneyCentsSchema.nonnegative(),
	client: z.string(),
	collectionProbability: z.number().min(0).max(100),
	dueDate: z.iso.date(),
	id: z.string(),
	owner: z.string(),
	status: invoiceStatusSchema,
});
