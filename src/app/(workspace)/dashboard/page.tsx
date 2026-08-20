import type { Metadata } from "next";
import { WorkspacePage } from "@/modules/page-shell/components/WorkspacePage";

export const metadata: Metadata = {
	title: "Today’s CashLift — CashLift",
	description: "Liquid-glass operating cockpit with command search, cash position, and next actions.",
};

export default async function DashboardHome() {
	return <WorkspacePage section="overview" />;
}
