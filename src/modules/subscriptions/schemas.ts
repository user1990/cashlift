import { z } from "zod";
import { MONEY_CENTS_SCHEMA } from "@/modules/money/schemas";

export const SUBSCRIPTION_STATUS_SCHEMA = z.enum(["active", "unused", "duplicate", "trial"]);

export const SUBSCRIPTION_SCHEMA = z.object({
	amountCents: MONEY_CENTS_SCHEMA.nonnegative(),
	id: z.string(),
	owner: z.string(),
	renewalDate: z.iso.date(),
	status: SUBSCRIPTION_STATUS_SCHEMA,
	usagePercent: z.number().int().min(0).max(100),
	vendor: z.string(),
});
