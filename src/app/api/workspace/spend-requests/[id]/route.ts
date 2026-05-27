import { NextResponse } from "next/server";
import { decideSpendRequest } from "@/modules/workspace/spendRequestDecisions";
import { apiError } from "../../dataset/errors";

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

export const PATCH = async (request: Request, context: RouteContext) => {
	const [{ id }, body] = await Promise.all([context.params, request.json().catch(() => null)]);
	const result = await decideSpendRequest({
		id,
		status: body?.status,
	});

	if (result.status === "success") {
		return NextResponse.json(result.request);
	}

	return apiError({
		code: ERROR_CODE[result.code],
		error: result.message,
		status: ERROR_STATUS[result.code],
	});
};
