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
	status: 401 | 403 | 500 | 503;
	requestId?: string;
};

export const apiError = ({ code, error, requestId, status }: ApiErrorParams) =>
	NextResponse.json<ApiErrorBody>({ code, error, requestId }, { status });
