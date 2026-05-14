import type { Metadata } from "next";
import { loadWorkspaceDataset } from "@/modules/base/finance/server";
import { DashboardContent } from "@/modules/features/dashboard/components/DashboardContent";
import { DashboardState } from "@/modules/features/dashboard/components/DashboardState";

export const metadata: Metadata = {
	title: "Today’s CashLift — CashLift",
	description: "Daily cash action inbox for approvals, collections, vendor leaks, and cash buffer decisions.",
};

export default async function AppHome() {
	const result = await loadWorkspaceDataset();

	if (result.status === "success") {
		return <DashboardContent dataset={result.dataset} />;
	}

	if (result.status === "unauthenticated") {
		return <DashboardState message={result.message} title="Sign in required" />;
	}

	if (result.status === "forbidden") {
		return <DashboardState message={result.message} title="No company workspace" />;
	}

	return <DashboardState message={result.message} title="Workspace data unavailable" />;
}
