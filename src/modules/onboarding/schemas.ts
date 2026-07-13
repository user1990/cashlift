import { z } from "zod";

export const workspaceSetupSchema = z.object({
	industry: z.enum(["agency", "consulting", "software-services"]),
	name: z.string().trim().min(2, "Enter your company workspace name.").max(120, "Use 120 characters or fewer."),
});
