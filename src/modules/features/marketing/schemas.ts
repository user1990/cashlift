import { z } from "zod";

export const leadCaptureSchema = z.object({
	company: z.string().min(2, { error: "Company name is required." }),
	email: z.email({ error: "Enter a work email." }),
	name: z.string().min(2, { error: "Your name is required." }),
});

export type LeadCaptureFormValues = z.infer<typeof leadCaptureSchema>;
