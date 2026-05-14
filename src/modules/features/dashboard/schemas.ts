import { z } from "zod";

export const spendRequestSchema = z.object({
	amount: z.number().min(1, "Enter a positive amount."),
	reason: z.string().min(8, "Add a business reason."),
	vendor: z.string().min(2, "Name the vendor."),
});

export type SpendRequestForm = z.infer<typeof spendRequestSchema>;
