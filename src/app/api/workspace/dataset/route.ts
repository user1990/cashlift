import { NextResponse } from "next/server";
import { resolveWorkspaceDataset } from "@/modules/workspace/resolveWorkspaceDataset";
import { apiError } from "./errors";

export const GET = async () => {
	const result = await resolveWorkspaceDataset();

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
