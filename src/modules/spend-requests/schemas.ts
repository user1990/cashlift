import { z } from "zod";

export const spendRequestDecisionSchema = z.object({
	id: z.string().min(1),
	status: z.enum(["approved", "rejected"]),
});

export type SpendRequestDecisionInput = z.infer<typeof spendRequestDecisionSchema>;
