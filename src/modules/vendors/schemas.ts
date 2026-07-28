import { z } from "zod";
import { MONEY_CENTS_SCHEMA } from "@/modules/money/schemas";

export const VENDOR_BILL_STATUS_SCHEMA = z.enum(["scheduled", "needs-review", "approved"]);

export const VENDOR_BILL_SCHEMA = z.object({
	amountCents: MONEY_CENTS_SCHEMA.nonnegative(),
	category: z.enum(["software", "contractor", "operations", "tax", "payroll"]),
	dueDate: z.iso.date(),
	essential: z.boolean(),
	id: z.string(),
	status: VENDOR_BILL_STATUS_SCHEMA,
	vendor: z.string(),
});
