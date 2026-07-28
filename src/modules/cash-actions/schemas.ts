import { z } from "zod";
import { COMPANY_ROLE_SCHEMA } from "@/modules/company-roles/schemas";
import { MONEY_CENTS_SCHEMA } from "@/modules/money/schemas";

export const ACTION_PRIORITY_SCHEMA = z.enum(["critical", "high", "medium", "low"]);

export const ACTION_STATUS_SCHEMA = z.enum(["open", "done"]);

export const CASH_ACTION_TYPE_SCHEMA = z.enum(["approval", "collection", "vendor-leak", "cash-buffer", "forecast"]);

export const CASH_ACTION_SCHEMA = z.object({
	description: z.string(),
	dueDate: z.iso.date(),
	id: z.string(),
	impactCents: MONEY_CENTS_SCHEMA.nonnegative(),
	owner: z.string(),
	priority: ACTION_PRIORITY_SCHEMA,
	status: ACTION_STATUS_SCHEMA,
	title: z.string(),
	type: CASH_ACTION_TYPE_SCHEMA,
	visibleTo: z.array(COMPANY_ROLE_SCHEMA),
});
