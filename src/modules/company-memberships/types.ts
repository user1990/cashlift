import type { z } from "zod";
import type { companyMembershipSchema, companyRoleSchema } from "./schemas";

export type CompanyRole = z.infer<typeof companyRoleSchema>;

export type CompanyMembership = z.infer<typeof companyMembershipSchema>;
