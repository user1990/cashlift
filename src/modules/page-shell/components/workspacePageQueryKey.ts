import type { FinancialDataset, WorkspaceDatasetDateRange } from "@/modules/workspace/types";
import type { WorkspacePageProps } from "./types";

type WorkspacePageQueryKeyParams = WorkspacePageProps & {
	dataset: FinancialDataset;
	initialDateRange?: WorkspaceDatasetDateRange;
};

export function getWorkspacePageQueryKey({ dataset, initialDateRange, section }: WorkspacePageQueryKeyParams) {
	if (section !== "overview") {
		return section;
	}

	const dateRange = initialDateRange ?? getForecastDateRange(dataset);

	return dateRange ? `${dateRange.startDate}:${dateRange.endDate}` : "overview:no-range";
}

export function getForecastDateRange(dataset: FinancialDataset): WorkspaceDatasetDateRange | undefined {
	const startDate = dataset.forecast[0]?.date;
	const endDate = dataset.forecast.at(-1)?.date;

	return startDate && endDate ? { endDate, startDate } : undefined;
}
