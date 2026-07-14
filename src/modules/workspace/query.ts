"use client";

import { useQuery } from "@tanstack/react-query";
import { financialDatasetSchema } from "./schemas";
import type { FinancialDataset, WorkspaceDatasetDateRange, WorkspaceDatasetScope } from "./types";

export const workspaceDatasetQueryKeys = {
	all: ["workspace", "dataset"] as const,
	scope: (scope: WorkspaceDatasetScope, dateRange?: WorkspaceDatasetDateRange) =>
		[...workspaceDatasetQueryKeys.all, scope, dateRange ?? null] as const,
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

	return financialDatasetSchema.parse(await response.json());
};

export const useWorkspaceDatasetQuery = (
	initialDataset: FinancialDataset,
	scope: WorkspaceDatasetScope,
	dateRange?: WorkspaceDatasetDateRange,
) =>
	useQuery({
		initialData: initialDataset,
		queryFn: () => fetchWorkspaceDataset(scope, dateRange),
		queryKey: workspaceDatasetQueryKeys.scope(scope, dateRange),
	});
