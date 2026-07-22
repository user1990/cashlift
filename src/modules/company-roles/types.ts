import type { z } from "zod";
import type { companyRoleSchema } from "./schemas";

export type CompanyRole = z.infer<typeof companyRoleSchema>;
