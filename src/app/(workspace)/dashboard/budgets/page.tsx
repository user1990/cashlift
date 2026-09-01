import type { Metadata } from "next";
import { WorkspacePage } from "@/modules/page-shell/components/WorkspacePage";

export const metadata: Metadata = {
	title: "Team budgets — CashLift",
};

export default function Budgets() {
	return <WorkspacePage section="budgets" />;
}
