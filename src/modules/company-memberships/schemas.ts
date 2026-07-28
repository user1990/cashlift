import { z } from "zod";
import { COMPANY_ROLE_SCHEMA } from "@/modules/company-roles/schemas";

export const COMPANY_MEMBERSHIP_SCHEMA = z.object({
	companyId: z.string(),
	role: COMPANY_ROLE_SCHEMA,
});
