import { redirect } from "next/navigation";
import { loadWorkspaceDataset } from "@/modules/workspace/server";
import type { WorkspacePageProps } from "./types";
import { WorkspaceLoadState } from "./WorkspaceLoadState";
import { WorkspacePageContent } from "./WorkspacePageContent";

export const WorkspacePage = async ({ section }: WorkspacePageProps) => {
	const result = await loadWorkspaceDataset(section);

	if (result.status === "success") {
		return <WorkspacePageContent dataset={result.dataset} section={section} />;
	}

	if (result.status === "unauthenticated") {
		return <WorkspaceLoadState message={result.message} section={section} title="Sign in required" />;
	}

	if (result.status === "forbidden") {
		redirect("/onboarding/recover");
	}

	return <WorkspaceLoadState message={result.message} section={section} title="Workspace data unavailable" />;
};
