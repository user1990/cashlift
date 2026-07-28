import { z } from "zod";
import { MONEY_CENTS_SCHEMA } from "@/modules/money/schemas";

export const INVOICE_STATUS_SCHEMA = z.enum(["sent", "overdue", "promised", "paid"]);

export const INVOICE_SCHEMA = z.object({
	amountCents: MONEY_CENTS_SCHEMA.nonnegative(),
	client: z.string(),
	collectionProbability: z.number().min(0).max(100),
	dueDate: z.iso.date(),
	id: z.string(),
	owner: z.string(),
	status: INVOICE_STATUS_SCHEMA,
});
