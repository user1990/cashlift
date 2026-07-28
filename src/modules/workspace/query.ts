"use client";

import { useQuery } from "@tanstack/react-query";
import { FINANCIAL_DATASET_SCHEMA } from "./schemas";
import type { FinancialDataset, WorkspaceDatasetDateRange, WorkspaceDatasetScope } from "./types";

export const WORKSPACE_DATASET_QUERY_KEYS = {
	all: ["workspace", "dataset"] as const,
	scope: (scope: WorkspaceDatasetScope, dateRange?: WorkspaceDatasetDateRange) =>
		[...WORKSPACE_DATASET_QUERY_KEYS.all, scope, dateRange ?? null] as const,
};

const fetchWorkspaceDataset = async (scope: WorkspaceDatasetScope, dateRange?: WorkspaceDatasetDateRange) => {
	const searchParams = new URLSearchParams({ scope });

	if (dateRange) {
		searchParams.set("endDate", dateRange.endDate);
		searchParams.set("startDate", dateRange.startDate);
	}

	const response = await fetch(`/api/workspace/dataset?${searchParams.toString()}`);

	if (!response.ok) {
		throw new Error("Unable to load workspace data.");
	}

	return FINANCIAL_DATASET_SCHEMA.parse(await response.json());
};

export const useWorkspaceDatasetQuery = (
	initialDataset: FinancialDataset,
	scope: WorkspaceDatasetScope,
	dateRange?: WorkspaceDatasetDateRange,
) =>
	useQuery({
		initialData: initialDataset,
		initialDataUpdatedAt:
			scope === "overview" &&
			(dateRange?.endDate !== initialDataset.forecast.at(-1)?.date ||
				dateRange?.startDate !== initialDataset.forecast[0]?.date)
				? 0
				: undefined,
		queryFn: () => fetchWorkspaceDataset(scope, dateRange),
		queryKey: WORKSPACE_DATASET_QUERY_KEYS.scope(scope, dateRange),
	});
