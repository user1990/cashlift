import { z } from "zod";
import { moneyCentsSchema } from "@/modules/money/schemas";

export const subscriptionStatusSchema = z.enum(["active", "unused", "duplicate", "trial"]);

export const subscriptionSchema = z.object({
	amountCents: moneyCentsSchema.nonnegative(),
	id: z.string(),
	owner: z.string(),
	renewalDate: z.iso.date(),
	status: subscriptionStatusSchema,
	usagePercent: z.number().min(0).max(100),
	vendor: z.string(),
});
