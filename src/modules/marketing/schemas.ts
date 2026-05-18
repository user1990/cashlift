import { z } from "zod";
import { countCharacters } from "@/utilities/text/countCharacters";

export const leadCaptureSchema = z.object({
	email: z.email({ error: "Enter a work email." }),
	company: z.string().refine((value) => countCharacters(value) >= 2, { error: "Company name is required." }),
	name: z.string().refine((value) => countCharacters(value) >= 2, { error: "Your name is required." }),
});

export type LeadCaptureFormValues = z.infer<typeof leadCaptureSchema>;
