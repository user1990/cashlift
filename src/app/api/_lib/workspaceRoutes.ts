import { resolveWorkspaceDataset } from "@/modules/workspace/resolveWorkspaceDataset";
import { WORKSPACE_DATASET_DATE_RANGE_SCHEMA, WORKSPACE_DATASET_SCOPE_SCHEMA } from "@/modules/workspace/schemas";
import { decideSpendRequest } from "@/modules/workspace/spendRequestDecisions";
import { apiError, workspaceApiJson } from "./responses";

type ApiRouteOptions = {
	deprecated?: boolean;
	successorPath?: string;
};

type RouteContext = {
	params: Promise<{
		id: string;
	}>;
};

const ERROR_STATUS = {
	forbidden: 403,
	invalid: 400,
	not_found: 404,
	service: 503,
	unauthenticated: 401,
	unavailable: 500,
} as const;

const ERROR_CODE = {
	forbidden: "workspace_forbidden",
	invalid: "api_request_failed",
	not_found: "api_request_failed",
	service: "workspace_service_unavailable",
	unauthenticated: "workspace_unauthenticated",
	unavailable: "workspace_data_unavailable",
} as const;

export const getWorkspaceDataset = async (request: Request, options: ApiRouteOptions = {}) => {
	const scope = requestUrlScope(request);
	const dateRange = requestUrlDateRange(request);

	if (!scope.success) {
		return apiError({
			code: "api_request_failed",
			deprecated: options.deprecated,
			error: "Workspace dataset scope is invalid.",
			request,
			successorPath: options.successorPath,
			status: 400,
		});
	}

	if (!dateRange.success) {
		return apiError({
			code: "api_request_failed",
			deprecated: options.deprecated,
			error: "Workspace dataset date range is invalid.",
			request,
			successorPath: options.successorPath,
			status: 400,
		});
	}

	const result = await resolveWorkspaceDataset(scope.data, dateRange.data);

	switch (result.kind) {
		case "success":
			return workspaceApiJson(result.dataset, {
				deprecated: options.deprecated,
				request,
				successorPath: options.successorPath,
			});
		case "config":
			return apiError({
				code: "workspace_config_unavailable",
				deprecated: options.deprecated,
				error: result.message,
				request,
				requestId: result.requestId,
				status: 503,
				successorPath: options.successorPath,
			});
		case "service":
			return apiError({
				code: "workspace_service_unavailable",
				deprecated: options.deprecated,
				error: result.message,
				request,
				requestId: result.requestId,
				status: 503,
				successorPath: options.successorPath,
			});
		case "unauthenticated":
			return apiError({
				code: "workspace_unauthenticated",
				deprecated: options.deprecated,
				error: result.message,
				request,
				status: 401,
				successorPath: options.successorPath,
			});
		case "forbidden":
			return apiError({
				code: "workspace_forbidden",
				deprecated: options.deprecated,
				error: result.message,
				request,
				status: 403,
				successorPath: options.successorPath,
			});
		case "data_error":
			return apiError({
				code: "workspace_data_unavailable",
				deprecated: options.deprecated,
				error: result.message,
				request,
				requestId: result.requestId,
				status: 500,
				successorPath: options.successorPath,
			});
	}
};

export const patchSpendRequest = async (request: Request, context: RouteContext, options: ApiRouteOptions = {}) => {
	const [{ id }, body] = await Promise.all([context.params, request.json().catch(() => null)]);
	const result = await decideSpendRequest({
		id,
		status: body?.status,
	});

	if (result.status === "success") {
		return workspaceApiJson(result.request, {
			deprecated: options.deprecated,
			request,
			successorPath: options.successorPath,
		});
	}

	return apiError({
		code: ERROR_CODE[result.code],
		deprecated: options.deprecated,
		error: result.message,
		request,
		requestId: result.requestId,
		status: ERROR_STATUS[result.code],
		successorPath: options.successorPath,
	});
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
