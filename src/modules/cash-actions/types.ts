import type { z } from "zod";
import type {
	ACTION_PRIORITY_SCHEMA,
	ACTION_STATUS_SCHEMA,
	CASH_ACTION_SCHEMA,
	CASH_ACTION_TYPE_SCHEMA,
} from "./schemas";

export type ActionPriority = z.infer<typeof ACTION_PRIORITY_SCHEMA>;

export type ActionStatus = z.infer<typeof ACTION_STATUS_SCHEMA>;

export type CashActionType = z.infer<typeof CASH_ACTION_TYPE_SCHEMA>;

export type CashAction = z.infer<typeof CASH_ACTION_SCHEMA>;
