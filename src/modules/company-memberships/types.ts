import type { z } from "zod";
import type { companyMembershipSchema } from "./schemas";

export type { CompanyRole } from "@/modules/company-roles/types";

export type CompanyMembership = z.infer<typeof companyMembershipSchema>;
