import { NextResponse } from "next/server";
import { SITE_URL } from "@/services/site";
import type { AppErrorCode } from "@/utilities/errors/AppError";

type ApiErrorBody = {
	code: AppErrorCode;
	detail: string;
	error: string;
	message: string;
	resolution: string;
	requestId?: string;
	status: number;
	title: string;
	type: string;
};

type ApiResponseInit = ResponseInit & {
	deprecated?: boolean;
	request: Request;
	successorPath?: string;
};

type ApiErrorParams = {
	code: AppErrorCode;
	error: string;
	request: Request;
	requestId?: string;
	status: 400 | 401 | 403 | 404 | 429 | 500 | 503;
	deprecated?: boolean;
	successorPath?: string;
};

const WORKSPACE_API_HEADERS = {
	"Cache-Control": "no-store",
	"RateLimit-Limit": "60",
	"RateLimit-Policy": "60;w=60",
	"RateLimit-Remaining": "59",
	"RateLimit-Reset": "60",
	"X-API-Version": "v1",
} as const;

export const workspaceApiJson = <Body>(
	body: Body,
	{ deprecated = false, request, successorPath, ...init }: ApiResponseInit,
) =>
	NextResponse.json<Body>(body, {
		...init,
		headers: createApiHeaders(request, init.headers, deprecated, init.status, successorPath),
	});

export const apiError = ({
	code,
	deprecated = false,
	error,
	request,
	requestId,
	status,
	successorPath,
}: ApiErrorParams) =>
	workspaceApiJson<ApiErrorBody>(
		{
			code,
			detail: error,
			error,
			message: error,
			resolution: getErrorResolution(code),
			requestId,
			status,
			title: getErrorTitle(code),
			type: `${SITE_URL}/problems/${code}`,
		},
		{
			deprecated,
			headers: { "Content-Type": "application/problem+json; charset=utf-8" },
			request,
			status,
			successorPath,
		},
	);

const createApiHeaders = (
	request: Request,
	initHeaders: HeadersInit | undefined,
	deprecated: boolean,
	status: number | undefined,
	successorPath: string | undefined,
) => {
	const headers = new Headers(WORKSPACE_API_HEADERS);

	if (initHeaders) {
		new Headers(initHeaders).forEach((value, key) => {
			headers.set(key, value);
		});
	}

	if (deprecated) {
		headers.set("Deprecation", "true");
		headers.set("Link", `<${SITE_URL}${successorPath ?? "/api/v1/workspace/dataset"}>; rel="successor-version"`);
	}

	if (status === 429) {
		headers.set("Retry-After", "60");
	}

	if (request.headers.get("Accept")) {
		headers.set("Vary", "Accept");
	}

	return headers;
};

const getErrorTitle = (code: AppErrorCode) => {
	const titles: Record<AppErrorCode, string> = {
		api_rate_limited: "API rate limit exceeded",
		api_request_failed: "API request failed",
		supabase_empty_row: "Workspace data unavailable",
		supabase_query_failed: "Workspace data unavailable",
		workspace_config_unavailable: "Workspace configuration unavailable",
		workspace_data_unavailable: "Workspace data unavailable",
		workspace_forbidden: "Workspace access forbidden",
		workspace_service_unavailable: "Workspace service unavailable",
		workspace_unauthenticated: "Workspace authentication required",
	};

	return titles[code];
};

const getErrorResolution = (code: AppErrorCode) => {
	const resolutions: Record<AppErrorCode, string> = {
		api_rate_limited: "Wait for the Retry-After interval, then retry with backoff.",
		api_request_failed: "Check the documented parameters and send an ISO date range with startDate before endDate.",
		supabase_empty_row: "Retry the request and contact CashLift support if the response persists.",
		supabase_query_failed: "Retry the request and include the request ID when contacting CashLift support.",
		workspace_config_unavailable: "Retry later while the CashLift workspace environment is configured.",
		workspace_data_unavailable: "Retry later and include the request ID when contacting CashLift support.",
		workspace_forbidden: "Authenticate with a session that belongs to a CashLift company workspace.",
		workspace_service_unavailable: "Retry with exponential backoff and preserve the request ID.",
		workspace_unauthenticated: "Authenticate with a Clerk session, then retry the request.",
	};

	return resolutions[code];
};
