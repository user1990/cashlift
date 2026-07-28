import type { z } from "zod";
import type {
	FINANCIAL_DATASET_SCHEMA,
	WORKSPACE_DATASET_DATE_RANGE_SCHEMA,
	WORKSPACE_DATASET_SCOPE_SCHEMA,
} from "./schemas";

export type WorkspaceDatasetScope = z.infer<typeof WORKSPACE_DATASET_SCOPE_SCHEMA>;

export type WorkspaceDatasetDateRange = z.infer<typeof WORKSPACE_DATASET_DATE_RANGE_SCHEMA>;

export type FinancialDataset = z.infer<typeof FINANCIAL_DATASET_SCHEMA>;
