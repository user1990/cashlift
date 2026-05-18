import { loadWorkspaceDataset } from "@/modules/workspace/server";
import { getCashLiftAppMode } from "@/services/env/app";
import type { WorkspacePageProps } from "./types";
import { WorkspaceLayout } from "./WorkspaceLayout";
import { WorkspaceState } from "./WorkspaceState";

export const WorkspacePage = async ({ section }: WorkspacePageProps) => {
	const result = await loadWorkspaceDataset();
	const mode = getCashLiftAppMode();

	if (result.status === "success") {
		return <WorkspaceLayout dataset={result.dataset} mode={mode} section={section} />;
	}

	if (result.status === "unauthenticated") {
		return <WorkspaceState message={result.message} section={section} title="Sign in required" />;
	}

	if (result.status === "forbidden") {
		return <WorkspaceState message={result.message} section={section} title="No company workspace" />;
	}

	return <WorkspaceState message={result.message} section={section} title="Workspace data unavailable" />;
};
