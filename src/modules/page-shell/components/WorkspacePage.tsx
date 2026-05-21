import { loadWorkspaceDataset } from "@/modules/workspace/server";
import { getCashLiftAppMode } from "@/services/env/app";
import type { WorkspacePageProps } from "./types";
import { WorkspaceLoadState } from "./WorkspaceLoadState";
import { WorkspaceShell } from "./WorkspaceShell";

export const WorkspacePage = async ({ section }: WorkspacePageProps) => {
	const result = await loadWorkspaceDataset(section);
	const mode = getCashLiftAppMode();

	if (result.status === "success") {
		return <WorkspaceShell dataset={result.dataset} mode={mode} section={section} />;
	}

	if (result.status === "unauthenticated") {
		return <WorkspaceLoadState message={result.message} section={section} title="Sign in required" />;
	}

	if (result.status === "forbidden") {
		return <WorkspaceLoadState message={result.message} section={section} title="No company workspace" />;
	}

	return <WorkspaceLoadState message={result.message} section={section} title="Workspace data unavailable" />;
};
