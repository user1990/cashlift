import { patchSpendRequest } from "@/app/api/_lib/workspaceRoutes";

type RouteContext = {
	params: Promise<{
		id: string;
	}>;
};

export const PATCH = async (request: Request, context: RouteContext) => {
	const params = await context.params;

	return patchSpendRequest(
		request,
		{ params: Promise.resolve(params) },
		{
			deprecated: true,
			successorPath: `/api/v1/workspace/spend-requests/${encodeURIComponent(params.id)}`,
		},
	);
};
