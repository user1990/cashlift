import { NextResponse } from "next/server";
import type { AppErrorCode } from "@/utilities/errors/AppError";

type ApiErrorBody = {
	code: AppErrorCode;
	error: string;
	requestId?: string;
};

type ApiErrorParams = {
	code: AppErrorCode;
	error: string;
	status: 400 | 401 | 403 | 404 | 500 | 503;
	requestId?: string;
};

const WORKSPACE_API_HEADERS = {
	"Cache-Control": "no-store",
} as const;

export const workspaceApiJson = <Body>(body: Body, init?: ResponseInit) =>
	NextResponse.json<Body>(body, {
		...init,
		headers: {
			...WORKSPACE_API_HEADERS,
			...init?.headers,
		},
	});

export const apiError = ({ code, error, requestId, status }: ApiErrorParams) =>
	workspaceApiJson<ApiErrorBody>({ code, error, requestId }, { status });
