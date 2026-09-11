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
	"X-API-Version": "v1",
} as const;

const RATE_LIMIT = 60;
const RATE_LIMIT_WINDOW_MS = 60_000;
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

type RateLimitState = {
	allowed: boolean;
	remaining: number;
	resetInSeconds: number;
};

export const workspaceApiJson = <Body>(
	body: Body,
	{ deprecated = false, request, successorPath, ...init }: ApiResponseInit,
) => {
	const rateLimit = consumeRateLimit(request);

	if (!rateLimit.allowed) {
		return NextResponse.json<ApiErrorBody>(
			{
				code: "api_rate_limited",
				detail: "CashLift API rate limit exceeded.",
				error: "CashLift API rate limit exceeded.",
				message: "CashLift API rate limit exceeded.",
				resolution: getErrorResolution("api_rate_limited"),
				status: 429,
				title: getErrorTitle("api_rate_limited"),
				type: `${SITE_URL}/problems/api_rate_limited`,
			},
			{
				status: 429,
				headers: createApiHeaders(
					request,
					{ "Content-Type": "application/problem+json; charset=utf-8" },
					false,
					429,
					undefined,
					rateLimit,
				),
			},
		);
	}

	return NextResponse.json<Body>(body, {
		...init,
		headers: createApiHeaders(request, init.headers, deprecated, init.status, successorPath, rateLimit),
	});
};

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
	rateLimit: RateLimitState,
) => {
	const headers = new Headers(WORKSPACE_API_HEADERS);
	headers.set("RateLimit-Limit", String(RATE_LIMIT));
	headers.set("RateLimit-Remaining", String(rateLimit.remaining));
	headers.set("RateLimit-Reset", String(rateLimit.resetInSeconds));

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
		headers.set("Retry-After", String(rateLimit.resetInSeconds));
	}

	if (request.headers.get("Accept")) {
		headers.set("Vary", "Accept");
	}

	return headers;
};

const consumeRateLimit = (request: Request): RateLimitState => {
	const now = Date.now();
	const key =
		request.headers.get("x-real-ip")?.trim() ||
		request.headers.get("x-forwarded-for")?.split(",", 1)[0]?.trim() ||
		"anonymous";
	const existing = rateLimitBuckets.get(key);
	const bucket = existing && existing.resetAt > now ? existing : { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };

	if (rateLimitBuckets.size > 10_000) {
		for (const [bucketKey, bucketValue] of rateLimitBuckets) {
			if (bucketValue.resetAt <= now) {
				rateLimitBuckets.delete(bucketKey);
			}
		}
	}

	if (bucket.count >= RATE_LIMIT) {
		rateLimitBuckets.set(key, bucket);

		return {
			allowed: false,
			remaining: 0,
			resetInSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
		};
	}

	bucket.count += 1;
	rateLimitBuckets.set(key, bucket);

	return {
		allowed: true,
		remaining: RATE_LIMIT - bucket.count,
		resetInSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
	};
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
