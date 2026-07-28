import { z } from "zod";

export const COMPANY_ROLE_SCHEMA = z.enum(["owner-finance", "manager", "employee"]);
