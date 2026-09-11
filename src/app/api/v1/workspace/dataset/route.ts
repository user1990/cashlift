import { getWorkspaceDataset } from "@/app/api/_lib/workspaceRoutes";

export const GET = (request: Request) => getWorkspaceDataset(request);
