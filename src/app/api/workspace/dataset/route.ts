import { NextResponse } from "next/server";
import { resolveWorkspaceDataset } from "@/modules/base/finance/resolveWorkspaceDataset";
import { apiError } from "./errors";

export const GET = async () => {
	const result = await resolveWorkspaceDataset();

	switch (result.kind) {
		case "success":
			return NextResponse.json(result.dataset);
		case "config":
		case "service":
			return apiError(result.message, 503);
		case "unauthenticated":
			return apiError(result.message, 401);
		case "forbidden":
			return apiError(result.message, 403);
		case "data_error":
			return apiError(result.message, 500);
	}
};
