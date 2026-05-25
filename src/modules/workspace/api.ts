import type { SpendRequestStatus } from "@/modules/spend-requests/types";
import type { FinancialDataset, SpendRequest, WorkspaceDatasetScope } from "./types";

export type FinanceRepository = {
	getWorkspaceDataset(userId: string, accessToken: string, scope: WorkspaceDatasetScope): Promise<FinancialDataset>;
	updateSpendRequestStatus(
		userId: string,
		accessToken: string,
		id: string,
		status: Exclude<SpendRequestStatus, "pending">,
	): Promise<SpendRequest>;
};
