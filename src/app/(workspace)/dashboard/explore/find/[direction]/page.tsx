import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FIND_DIRECTIONS, isFindDirectionId } from "@/modules/dashboard/explore/find/directions";
import { FindExplorer } from "@/modules/dashboard/explore/find/FindExplorer";
import { WorkspaceLoadState } from "@/modules/page-shell/components/WorkspaceLoadState";
import { loadWorkspaceDataset } from "@/modules/workspace/server";

type FindDirectionPageProps = {
	params: Promise<{ direction: string }>;
};

export function generateStaticParams() {
	return Object.keys(FIND_DIRECTIONS).map((direction) => ({ direction }));
}

export async function generateMetadata({ params }: FindDirectionPageProps): Promise<Metadata> {
	const { direction: directionId } = await params;

	if (!isFindDirectionId(directionId)) {
		return { title: "Find prototype — CashLift" };
	}

	return {
		title: `${FIND_DIRECTIONS[directionId].name} find prototype — CashLift`,
		description: FIND_DIRECTIONS[directionId].summary,
	};
}

export default async function FindDirectionPage({ params }: FindDirectionPageProps) {
	const { direction: directionId } = await params;

	if (!isFindDirectionId(directionId)) {
		notFound();
	}

	const result = await loadWorkspaceDataset("overview");

	if (result.status === "success") {
		return <FindExplorer dataset={result.dataset} direction={directionId} />;
	}

	if (result.status === "unauthenticated") {
		return <WorkspaceLoadState message={result.message} section="overview" title="Sign in required" />;
	}

	if (result.status === "forbidden") {
		return <WorkspaceLoadState message={result.message} section="overview" title="No company workspace" />;
	}

	return <WorkspaceLoadState message={result.message} section="overview" title="Workspace data unavailable" />;
}
