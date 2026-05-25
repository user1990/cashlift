"use client";

import { useQuery } from "@tanstack/react-query";
import type { FinancialDataset, WorkspaceDatasetScope } from "./types";

export const workspaceDatasetQueryKeys = {
	all: ["workspace", "dataset"] as const,
	scope: (scope: WorkspaceDatasetScope) => [...workspaceDatasetQueryKeys.all, scope] as const,
};

const fetchWorkspaceDataset = async (scope: WorkspaceDatasetScope) => {
	const response = await fetch(`/api/workspace/dataset?scope=${scope}`);

	if (!response.ok) {
		throw new Error("Unable to load workspace data.");
	}

	return response.json() as Promise<FinancialDataset>;
};

export const useWorkspaceDatasetQuery = (initialDataset: FinancialDataset, scope: WorkspaceDatasetScope) =>
	useQuery({
		initialData: initialDataset,
		queryFn: () => fetchWorkspaceDataset(scope),
		queryKey: workspaceDatasetQueryKeys.scope(scope),
	});
