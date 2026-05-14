"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchWorkspaceDataset } from "../api";

const WORKSPACE_DATASET_QUERY_KEY = ["workspace-dataset"];

export const useWorkspaceDatasetQuery = () =>
	useQuery({
		queryFn: fetchWorkspaceDataset,
		queryKey: WORKSPACE_DATASET_QUERY_KEY,
	});
