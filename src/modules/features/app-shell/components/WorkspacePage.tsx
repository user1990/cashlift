"use client";

import { useWorkspaceDatasetQuery } from "@/modules/base/finance/hooks/useWorkspaceDatasetQuery";
import type { WorkspacePageProps } from "./types";
import { WorkspaceLayout } from "./WorkspaceLayout";
import { WorkspaceState } from "./WorkspaceState";

export const WorkspacePage = ({ section }: WorkspacePageProps) => {
	const { data, error, isPending } = useWorkspaceDatasetQuery();

	if (isPending) {
		return <WorkspaceState message="Loading workspace data..." section={section} title="Workspace" />;
	}

	if (error) {
		return <WorkspaceState message={error.message} section={section} title="Workspace data unavailable" />;
	}

	if (!data) {
		return (
			<WorkspaceState message="Workspace data returned empty." section={section} title="Workspace data unavailable" />
		);
	}

	return <WorkspaceLayout dataset={data} section={section} />;
};
