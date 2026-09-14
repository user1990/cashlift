import { apiError, workspaceApiJson } from "@/app/api/_lib/responses";
import { DEMO_WORKSPACE_DATASET } from "@/modules/workspace/demoDataset";
import { reduceDatasetForDateRange, reduceDatasetForScope } from "@/modules/workspace/read-models";
import { WORKSPACE_DATASET_DATE_RANGE_SCHEMA, WORKSPACE_DATASET_SCOPE_SCHEMA } from "@/modules/workspace/schemas";

export function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const scope = WORKSPACE_DATASET_SCOPE_SCHEMA.safeParse(searchParams.get("scope") ?? "overview");

	if (!scope.success) {
		return apiError({
			code: "api_request_failed",
			error: "Demo dataset scope is invalid.",
			request,
			status: 400,
		});
	}

	const startDate = searchParams.get("startDate");
	const endDate = searchParams.get("endDate");
	const dateRange =
		!startDate && !endDate
			? { data: undefined, success: true }
			: WORKSPACE_DATASET_DATE_RANGE_SCHEMA.safeParse({ endDate, startDate });

	if (!dateRange.success) {
		return apiError({
			code: "api_request_failed",
			error: "Demo dataset date range is invalid.",
			request,
			status: 400,
		});
	}

	const dataset = reduceDatasetForDateRange(reduceDatasetForScope(DEMO_WORKSPACE_DATASET, scope.data), dateRange.data);

	return workspaceApiJson(dataset, { request });
}
