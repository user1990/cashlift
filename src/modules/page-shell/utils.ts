import type { FinancialDataset, WorkspaceDatasetDateRange } from "@/modules/workspace/types";

export function getForecastDateRange(dataset: FinancialDataset): WorkspaceDatasetDateRange | undefined {
	const startDate = dataset.forecast[0]?.date;
	const endDate = dataset.forecast.at(-1)?.date;

	return startDate && endDate ? { endDate, startDate } : undefined;
}
