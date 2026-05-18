import type { FinancialDataset } from "./types";

export type FinanceRepository = {
	getDashboardDataset(userId: string, accessToken: string): Promise<FinancialDataset>;
};
