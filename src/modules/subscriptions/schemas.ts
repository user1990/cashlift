import { z } from "zod";
import { moneyCentsSchema } from "@/modules/money/schemas";

export const subscriptionStatusSchema = z.enum(["active", "unused", "duplicate", "trial"]);

export const subscriptionSchema = z.object({
	amountCents: moneyCentsSchema,
	id: z.string(),
	owner: z.string(),
	renewalDate: z.string(),
	status: subscriptionStatusSchema,
	usagePercent: z.number(),
	vendor: z.string(),
});
