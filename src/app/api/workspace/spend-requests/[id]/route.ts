import { patchSpendRequest } from "@/app/api/_lib/workspaceRoutes";

type RouteContext = {
	params: Promise<{
		id: string;
	}>;
};

export const PATCH = (request: Request, context: RouteContext) =>
	patchSpendRequest(request, context, {
		deprecated: true,
		successorPath: "/api/v1/workspace/spend-requests/{id}",
	});
