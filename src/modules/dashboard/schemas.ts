import { z } from "zod";
import { countCharacters } from "@/utilities/text/countCharacters";

export const spendRequestSchema = z.object({
	amount: z.number().min(1, "Enter a positive amount."),
	reason: z.string().refine((value) => countCharacters(value) >= 8, "Add a business reason."),
	vendor: z.string().refine((value) => countCharacters(value) >= 2, "Name the vendor."),
});
