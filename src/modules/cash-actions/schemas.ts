import { z } from "zod";
import { companyRoleSchema } from "@/modules/company-roles/schemas";
import { moneyCentsSchema } from "@/modules/money/schemas";

export const actionPrioritySchema = z.enum(["critical", "high", "medium", "low"]);

export const actionStatusSchema = z.enum(["open", "done"]);

export const cashActionTypeSchema = z.enum(["approval", "collection", "vendor-leak", "cash-buffer", "forecast"]);

export const cashActionSchema = z.object({
	description: z.string(),
	dueDate: z.string(),
	id: z.string(),
	impactCents: moneyCentsSchema,
	owner: z.string(),
	priority: actionPrioritySchema,
	status: actionStatusSchema,
	title: z.string(),
	type: cashActionTypeSchema,
	visibleTo: z.array(companyRoleSchema),
});
