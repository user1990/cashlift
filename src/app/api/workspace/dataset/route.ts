import { getWorkspaceDataset } from "@/app/api/_lib/workspaceRoutes";

export const GET = (request: Request) =>
	getWorkspaceDataset(request, { deprecated: true, successorPath: "/api/v1/workspace/dataset" });
