import { z } from "zod";
import { moneyCentsSchema } from "@/modules/money/schemas";

export const vendorBillStatusSchema = z.enum(["scheduled", "needs-review", "approved"]);

export const vendorBillSchema = z.object({
	amountCents: moneyCentsSchema,
	category: z.enum(["software", "contractor", "operations", "tax", "payroll"]),
	dueDate: z.string(),
	essential: z.boolean(),
	id: z.string(),
	status: vendorBillStatusSchema,
	vendor: z.string(),
});
