import type { z } from "zod";
import type { COMPANY_ROLE_SCHEMA } from "./schemas";

export type CompanyRole = z.infer<typeof COMPANY_ROLE_SCHEMA>;
