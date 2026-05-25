import { z } from "zod";
import { moneyCentsSchema } from "@/modules/money/schemas";

export const spendRequestStatusSchema = z.enum(["pending", "approved", "rejected"]);

export const spendRequestSchema = z.object({
	amountCents: moneyCentsSchema,
	category: z.enum(["software", "travel", "contractor", "marketing", "hardware"]),
	id: z.string(),
	neededByDate: z.string(),
	reason: z.string(),
	requestedDate: z.string(),
	requester: z.string(),
	status: spendRequestStatusSchema,
	team: z.string(),
	vendor: z.string(),
});

export const spendRequestDecisionSchema = z.object({
	id: z.string().min(1),
	status: z.enum(["approved", "rejected"]),
});

export type SpendRequestDecisionInput = z.infer<typeof spendRequestDecisionSchema>;
