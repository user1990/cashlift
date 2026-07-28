import type { z } from "zod";
import type { COMPANY_MEMBERSHIP_SCHEMA } from "./schemas";

export type CompanyMembership = z.infer<typeof COMPANY_MEMBERSHIP_SCHEMA>;
