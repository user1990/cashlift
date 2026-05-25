import type { z } from "zod";
import type { teamBudgetSchema } from "./schemas";

export type TeamBudget = z.infer<typeof teamBudgetSchema>;
