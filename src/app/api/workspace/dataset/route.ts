import { resolveWorkspaceDataset } from "@/modules/workspace/resolveWorkspaceDataset";
import { WORKSPACE_DATASET_DATE_RANGE_SCHEMA, WORKSPACE_DATASET_SCOPE_SCHEMA } from "@/modules/workspace/schemas";
import { apiError, workspaceApiJson } from "./errors";

export const GET = async (request: Request) => {
	const scope = requestUrlScope(request);
	const dateRange = requestUrlDateRange(request);

	if (!scope.success) {
		return apiError({
			code: "api_request_failed",
			error: "Workspace dataset scope is invalid.",
			status: 400,
		});
	}

	if (!dateRange.success) {
		return apiError({
			code: "api_request_failed",
			error: "Workspace dataset date range is invalid.",
			status: 400,
		});
	}

	const result = await resolveWorkspaceDataset(scope.data, dateRange.data);

	switch (result.kind) {
		case "success":
			return workspaceApiJson(result.dataset);
		case "config":
			return apiError({
				code: "workspace_config_unavailable",
				error: result.message,
				requestId: result.requestId,
				status: 503,
			});
		case "service":
			return apiError({
				code: "workspace_service_unavailable",
				error: result.message,
				requestId: result.requestId,
				status: 503,
			});
		case "unauthenticated":
			return apiError({ code: "workspace_unauthenticated", error: result.message, status: 401 });
		case "forbidden":
			return apiError({ code: "workspace_forbidden", error: result.message, status: 403 });
		case "data_error":
			return apiError({
				code: "workspace_data_unavailable",
				error: result.message,
				requestId: result.requestId,
				status: 500,
			});
	}
};

function requestUrlScope(request: Request) {
	const { searchParams } = new URL(request.url);

	return WORKSPACE_DATASET_SCOPE_SCHEMA.safeParse(searchParams.get("scope") ?? "overview");
}

function requestUrlDateRange(request: Request) {
	const { searchParams } = new URL(request.url);
	const endDate = searchParams.get("endDate");
	const startDate = searchParams.get("startDate");

	if (!endDate && !startDate) {
		return { data: undefined, success: true } as const;
	}

	return WORKSPACE_DATASET_DATE_RANGE_SCHEMA.safeParse({ endDate, startDate });
}
