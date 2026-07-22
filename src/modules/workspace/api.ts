import type { SpendRequest, SpendRequestStatus } from "@/modules/spend-requests/types";
import type { FinancialDataset, WorkspaceDatasetScope } from "./types";

export type FinanceRepository = {
	getWorkspaceDataset(userId: string, accessToken: string, scope: WorkspaceDatasetScope): Promise<FinancialDataset>;
	updateSpendRequestStatus(
		companyId: string,
		accessToken: string,
		id: string,
		status: Exclude<SpendRequestStatus, "pending">,
	): Promise<SpendRequest>;
};
