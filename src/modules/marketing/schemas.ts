import { z } from "zod";
import { countCharacters } from "@/utilities/text/countCharacters";

export const LEAD_CAPTURE_SCHEMA = z.object({
	email: z.email({ error: "Enter a work email." }),
	company: z.string().refine((value) => countCharacters(value) >= 2, { error: "Company name is required." }),
	name: z.string().refine((value) => countCharacters(value) >= 2, { error: "Your name is required." }),
});

export type LeadCaptureFormValues = z.infer<typeof LEAD_CAPTURE_SCHEMA>;

export const HELP_FAQ_QUERY_MAX_CHARACTERS = 120;

export const HELP_FAQ_QUERY_SCHEMA = z
	.string()
	.refine((value) => countCharacters(value) <= HELP_FAQ_QUERY_MAX_CHARACTERS);
