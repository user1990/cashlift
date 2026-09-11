"use client";

import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import type { AppErrorCode } from "@/utilities/errors/AppError";
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

	const response = await fetch(`/api/v1/workspace/dataset?${searchParams.toString()}`);

	if (!response.ok) {
		const body = WORKSPACE_API_ERROR_SCHEMA.safeParse(await response.json().catch(() => null));

		throw new WorkspaceDatasetQueryError({
			code: body.success ? body.data.code : "workspace_data_unavailable",
			message: body.success ? body.data.error : "Unable to load workspace data.",
			requestId: body.success ? body.data.requestId : undefined,
			status: response.status,
		});
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
		retry: (failureCount, error) => !isPermanentWorkspaceDatasetError(error) && failureCount < 2,
	});

const WORKSPACE_API_ERROR_SCHEMA = z.object({
	code: z.string(),
	error: z.string().optional(),
	requestId: z.string().optional(),
});

type WorkspaceDatasetQueryErrorParams = {
	code: string;
	message?: string;
	requestId?: string;
	status: number;
};

class WorkspaceDatasetQueryError extends Error {
	readonly code: string;
	readonly requestId?: string;
	readonly status: number;

	constructor({
		code,
		message = "Unable to load workspace data.",
		requestId,
		status,
	}: WorkspaceDatasetQueryErrorParams) {
		super(message);
		this.name = "WorkspaceDatasetQueryError";
		this.code = code;
		this.requestId = requestId;
		this.status = status;
	}
}

export const isPermanentWorkspaceDatasetError = (error: unknown) => {
	if (!(error instanceof WorkspaceDatasetQueryError)) {
		return false;
	}

	return (
		error.status === 401 ||
		error.status === 403 ||
		error.code === ("workspace_unauthenticated" satisfies AppErrorCode) ||
		error.code === ("workspace_forbidden" satisfies AppErrorCode)
	);
};
