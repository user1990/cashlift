import type { Metadata } from "next";
import { WorkspacePage } from "@/modules/page-shell/components/WorkspacePage";

export const metadata: Metadata = {
	title: "Today’s CashLift — CashLift",
	description: "Daily cash action inbox for approvals, collections, vendor leaks, and cash buffer decisions.",
};

export default async function AppHome() {
	return <WorkspacePage section="overview" />;
}
