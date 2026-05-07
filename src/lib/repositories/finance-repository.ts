import type { FinancialDataset } from "@/lib/finance/types";

export type FinanceRepository = {
	getDashboardDataset(userId: string): Promise<FinancialDataset>;
};
