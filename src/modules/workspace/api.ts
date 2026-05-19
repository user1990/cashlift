import type { FinancialDataset, WorkspaceDatasetScope } from "./types";

export type FinanceRepository = {
	getWorkspaceDataset(userId: string, accessToken: string, scope: WorkspaceDatasetScope): Promise<FinancialDataset>;
};
