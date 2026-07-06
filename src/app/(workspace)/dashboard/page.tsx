import type { Metadata } from "next";
import { WorkspacePage } from "@/modules/page-shell/components/WorkspacePage";
import { parseInitialDateRange } from "./dateRangeParams";

export const metadata: Metadata = {
	title: "Today’s CashLift — CashLift",
	description: "Daily cash action inbox for approvals, collections, vendor leaks, and cash buffer decisions.",
};

type DashboardHomeProps = {
	searchParams: Promise<{
		endDate?: string;
		startDate?: string;
	}>;
};

export default async function DashboardHome({ searchParams }: DashboardHomeProps) {
	const { endDate, startDate } = await searchParams;
	const initialDateRange = parseInitialDateRange(startDate, endDate);

	return <WorkspacePage initialDateRange={initialDateRange} section="overview" />;
}
