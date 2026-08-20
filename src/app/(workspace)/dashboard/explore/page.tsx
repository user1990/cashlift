import type { Metadata } from "next";
import { ExplorePrototype } from "@/modules/dashboard/explore/ExplorePrototype";
import { WorkspaceLoadState } from "@/modules/page-shell/components/WorkspaceLoadState";
import { loadWorkspaceDataset } from "@/modules/workspace/server";

export const metadata: Metadata = {
	title: "Operating cockpit prototype — CashLift",
	description: "Liquid-glass dashboard prototype with header search and filters.",
};

export default async function DashboardExplorePage() {
	const result = await loadWorkspaceDataset("overview");

	if (result.status === "success") {
		return <ExplorePrototype dataset={result.dataset} />;
	}

	if (result.status === "unauthenticated") {
		return <WorkspaceLoadState message={result.message} section="overview" title="Sign in required" />;
	}

	if (result.status === "forbidden") {
		return <WorkspaceLoadState message={result.message} section="overview" title="No company workspace" />;
	}

	return <WorkspaceLoadState message={result.message} section="overview" title="Workspace data unavailable" />;
}
