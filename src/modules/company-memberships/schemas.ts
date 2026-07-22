import { z } from "zod";
import { companyRoleSchema } from "@/modules/company-roles/schemas";

export { companyRoleSchema };

export const companyMembershipSchema = z.object({
	companyId: z.string(),
	role: companyRoleSchema,
});
