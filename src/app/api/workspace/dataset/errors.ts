import { NextResponse } from "next/server";

type ApiErrorBody = {
	error: string;
};

export const apiError = (error: string, status: 401 | 403 | 500 | 503) =>
	NextResponse.json<ApiErrorBody>({ error }, { status });
