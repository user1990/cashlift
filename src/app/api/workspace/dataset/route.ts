import { NextResponse } from "next/server";
import { resolveWorkspaceDataset } from "@/modules/workspace/resolveWorkspaceDataset";
import { workspaceDatasetScopeSchema } from "@/modules/workspace/schemas";
import { apiError } from "./errors";

export const GET = async (request: Request) => {
	const scope = requestUrlScope(request);

	if (!scope.success) {
		return apiError({
			code: "api_request_failed",
			error: "Workspace dataset scope is invalid.",
			status: 400,
		});
	}

	const result = await resolveWorkspaceDataset(scope.data);

	switch (result.kind) {
		case "success":
			return NextResponse.json(result.dataset);
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

	return workspaceDatasetScopeSchema.safeParse(searchParams.get("scope") ?? "overview");
}
