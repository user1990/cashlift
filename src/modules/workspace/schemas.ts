import { z } from "zod";

export const workspaceDatasetScopeSchema = z.enum([
	"approvals",
	"budgets",
	"cash",
	"invoices",
	"overview",
	"settings",
	"team",
	"vendors",
]);
