import type { FinancialDataset } from "./types";

export type FinanceRepository = {
	getDashboardDataset(userId: string): Promise<FinancialDataset>;
};
