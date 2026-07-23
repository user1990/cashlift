import type { z } from "zod";
import type { financialDatasetSchema, workspaceDatasetDateRangeSchema, workspaceDatasetScopeSchema } from "./schemas";

export type WorkspaceDatasetScope = z.infer<typeof workspaceDatasetScopeSchema>;

export type WorkspaceDatasetDateRange = z.infer<typeof workspaceDatasetDateRangeSchema>;

export type FinancialDataset = z.infer<typeof financialDatasetSchema>;
