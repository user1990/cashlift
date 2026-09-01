import type { Metadata } from "next";
import { WorkspacePage } from "@/modules/page-shell/components/WorkspacePage";

export const metadata: Metadata = {
	title: "Cash Insights — CashLift",
	description: "Cash on hand, cash buffer, payroll, and the 13-week Cash Outlook in the liquid-glass workspace.",
};

export default function Cash() {
	return <WorkspacePage section="cash" />;
}
