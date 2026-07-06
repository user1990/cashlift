import { loadWorkspaceDataset } from "@/modules/workspace/server";
import type { WorkspaceDatasetDateRange } from "@/modules/workspace/types";
import type { WorkspacePageProps } from "./types";
import { WorkspaceLoadState } from "./WorkspaceLoadState";
import { WorkspacePageContent } from "./WorkspacePageContent";

type WorkspacePageComponentProps = WorkspacePageProps & {
	initialDateRange?: WorkspaceDatasetDateRange;
};

export const WorkspacePage = async ({ initialDateRange, section }: WorkspacePageComponentProps) => {
	const result = await loadWorkspaceDataset(section);

	if (result.status === "success") {
		return <WorkspacePageContent dataset={result.dataset} initialDateRange={initialDateRange} section={section} />;
	}

	if (result.status === "unauthenticated") {
		return <WorkspaceLoadState message={result.message} section={section} title="Sign in required" />;
	}

	if (result.status === "forbidden") {
		return <WorkspaceLoadState message={result.message} section={section} title="No company workspace" />;
	}

	return <WorkspaceLoadState message={result.message} section={section} title="Workspace data unavailable" />;
};
