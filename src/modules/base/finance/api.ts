import type { FinancialDataset } from "./types";

export type FinanceRepository = {
	getDashboardDataset(userId: string, accessToken: string): Promise<FinancialDataset>;
};

export const fetchWorkspaceDataset = async () => {
	const response = await fetch("/api/workspace/dataset");

	if (!response.ok) {
		const body = (await response.json().catch(() => null)) as { error?: string } | null;

		throw new Error(body?.error ?? "Unable to load workspace data.");
	}

	return (await response.json()) as FinancialDataset;
};
