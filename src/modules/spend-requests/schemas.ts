import { z } from "zod";
import { MONEY_CENTS_SCHEMA } from "@/modules/money/schemas";

export const SPEND_REQUEST_STATUS_SCHEMA = z.enum(["pending", "approved", "rejected"]);

export const SPEND_REQUEST_SCHEMA = z.object({
	amountCents: MONEY_CENTS_SCHEMA.nonnegative(),
	category: z.enum(["software", "travel", "contractor", "marketing", "hardware"]),
	id: z.string(),
	neededByDate: z.iso.date(),
	reason: z.string(),
	requestedDate: z.iso.date(),
	requester: z.string(),
	status: SPEND_REQUEST_STATUS_SCHEMA,
	team: z.string(),
	vendor: z.string(),
});

export const SPEND_REQUEST_DECISION_SCHEMA = z.object({
	id: z.string().min(1),
	status: z.enum(["approved", "rejected"]),
});

export type SpendRequestDecisionInput = z.infer<typeof SPEND_REQUEST_DECISION_SCHEMA>;
