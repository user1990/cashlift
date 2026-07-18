"use client";

import { parseAsString, useQueryStates } from "nuqs";
import { workspaceDatasetDateRangeSchema } from "@/modules/workspace/schemas";
import type { FinancialDataset, WorkspaceDatasetDateRange } from "@/modules/workspace/types";
import { getForecastDateRange } from "./workspacePageDateRange";

const OVERVIEW_DATE_RANGE_QUERY_PARAMS = {
	endDate: parseAsString,
	startDate: parseAsString,
};

export const useOverviewDateRangeQueryState = (dataset: FinancialDataset) => {
	const [queryDateRange, setQueryDateRange] = useQueryStates(OVERVIEW_DATE_RANGE_QUERY_PARAMS, {
		history: "push",
	});
	const defaultDateRange = getForecastDateRange(dataset);
	const dateRange = getDateRange(queryDateRange) ?? defaultDateRange;

	const setDateRange = (nextDateRange: WorkspaceDatasetDateRange) => {
		void setQueryDateRange(toQueryDateRange(nextDateRange, defaultDateRange));
	};

	return { dateRange, setDateRange };
};

function getDateRange(queryDateRange: { endDate: string | null; startDate: string | null }) {
	const result = workspaceDatasetDateRangeSchema.safeParse(queryDateRange);

	return result.success ? result.data : undefined;
}

function toQueryDateRange(
	dateRange: WorkspaceDatasetDateRange,
	defaultDateRange: WorkspaceDatasetDateRange | undefined,
) {
	return dateRange.startDate === defaultDateRange?.startDate && dateRange.endDate === defaultDateRange?.endDate
		? { endDate: null, startDate: null }
		: dateRange;
}
