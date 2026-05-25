import type { z } from "zod";
import type { actionPrioritySchema, actionStatusSchema, cashActionSchema, cashActionTypeSchema } from "./schemas";

export type ActionPriority = z.infer<typeof actionPrioritySchema>;

export type ActionStatus = z.infer<typeof actionStatusSchema>;

export type CashActionType = z.infer<typeof cashActionTypeSchema>;

export type CashAction = z.infer<typeof cashActionSchema>;
