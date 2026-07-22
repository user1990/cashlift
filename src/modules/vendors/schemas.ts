import { z } from "zod";
import { moneyCentsSchema } from "@/modules/money/schemas";

export const vendorBillStatusSchema = z.enum(["scheduled", "needs-review", "approved"]);

export const vendorBillSchema = z.object({
	amountCents: moneyCentsSchema.nonnegative(),
	category: z.enum(["software", "contractor", "operations", "tax", "payroll"]),
	dueDate: z.iso.date(),
	essential: z.boolean(),
	id: z.string(),
	status: vendorBillStatusSchema,
	vendor: z.string(),
});
