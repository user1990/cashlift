import { z } from "zod";
import { moneyCentsSchema } from "@/modules/money/schemas";

export const invoiceStatusSchema = z.enum(["sent", "overdue", "promised", "paid"]);

export const invoiceSchema = z.object({
	amountCents: moneyCentsSchema,
	client: z.string(),
	collectionProbability: z.number(),
	dueDate: z.string(),
	id: z.string(),
	owner: z.string(),
	status: invoiceStatusSchema,
});
