import { z } from "zod";
import { companyRoleSchema } from "@/modules/company-roles/schemas";

export const companyMembershipSchema = z.object({
	companyId: z.string(),
	role: companyRoleSchema,
});
