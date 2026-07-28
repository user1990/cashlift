import type { z } from "zod";
import type { TEAM_BUDGET_SCHEMA } from "./schemas";

export type TeamBudget = z.infer<typeof TEAM_BUDGET_SCHEMA>;
