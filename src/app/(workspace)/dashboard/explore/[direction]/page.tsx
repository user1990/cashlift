import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EXPLORE_DIRECTIONS, isExploreDirectionId } from "@/modules/dashboard/explore/directions";
import { ExploreDashboard } from "@/modules/dashboard/explore/ExploreDashboard";
import { WorkspaceLoadState } from "@/modules/page-shell/components/WorkspaceLoadState";
import { loadWorkspaceDataset } from "@/modules/workspace/server";

type ExploreDirectionPageProps = {
	params: Promise<{ direction: string }>;
};

export function generateStaticParams() {
	return Object.keys(EXPLORE_DIRECTIONS).map((direction) => ({ direction }));
}

export async function generateMetadata({ params }: ExploreDirectionPageProps): Promise<Metadata> {
	const { direction: directionId } = await params;

	if (!isExploreDirectionId(directionId)) {
		return { title: "Dashboard prototype — CashLift" };
	}

	return {
		title: `${EXPLORE_DIRECTIONS[directionId].name} prototype — CashLift`,
		description: EXPLORE_DIRECTIONS[directionId].summary,
	};
}

export default async function ExploreDirectionPage({ params }: ExploreDirectionPageProps) {
	const { direction: directionId } = await params;

	if (!isExploreDirectionId(directionId)) {
		notFound();
	}

	const result = await loadWorkspaceDataset("overview");

	if (result.status === "success") {
		return <ExploreDashboard dataset={result.dataset} direction={directionId} />;
	}

	if (result.status === "unauthenticated") {
		return <WorkspaceLoadState message={result.message} section="overview" title="Sign in required" />;
	}

	if (result.status === "forbidden") {
		return <WorkspaceLoadState message={result.message} section="overview" title="No company workspace" />;
	}

	return <WorkspaceLoadState message={result.message} section="overview" title="Workspace data unavailable" />;
}
