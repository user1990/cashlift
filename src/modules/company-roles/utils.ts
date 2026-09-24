import type { CompanyRole } from "./types";

export const canDecideSpendRequests = (role: CompanyRole) => role === "owner-finance" || role === "manager";
