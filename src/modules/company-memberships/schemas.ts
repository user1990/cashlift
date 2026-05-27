import { z } from "zod";

export const companyRoleSchema = z.enum(["owner-finance", "manager", "employee"]);

export const companyMembershipSchema = z.object({
	companyId: z.string(),
	role: companyRoleSchema,
});
