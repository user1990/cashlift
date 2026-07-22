import type { FinancialDataset, WorkspaceDatasetScope } from "@/modules/workspace/types";
import type { ResolveWorkspaceDatasetResult } from "./resolveWorkspaceDataset";
import { resolveWorkspaceDataset } from "./resolveWorkspaceDataset";

export type WorkspaceDatasetLoadResult =
	| {
			dataset: FinancialDataset;
			status: "success";
	  }
	| {
			message: string;
			requestId?: string;
			status: "forbidden" | "unauthenticated" | "unavailable";
	  };

const mapFailure = (
	result: Exclude<ResolveWorkspaceDatasetResult, { kind: "success" }>,
): Extract<WorkspaceDatasetLoadResult, { status: "forbidden" | "unauthenticated" | "unavailable" }> => {
	if (result.kind === "unauthenticated") {
		return { message: result.message, status: "unauthenticated" };
	}

	if (result.kind === "forbidden") {
		return { message: result.message, status: "forbidden" };
	}

	return { message: result.message, requestId: result.requestId, status: "unavailable" };
};

export const loadWorkspaceDataset = async (
	scope: WorkspaceDatasetScope = "overview",
): Promise<WorkspaceDatasetLoadResult> => {
	const result = await resolveWorkspaceDataset(scope);

	return result.kind === "success" ? { dataset: result.dataset, status: "success" } : mapFailure(result);
};
