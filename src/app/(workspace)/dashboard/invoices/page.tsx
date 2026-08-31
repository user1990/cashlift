import type { Metadata } from "next";
import { WorkspacePage } from "@/modules/page-shell/components/WorkspacePage";

export const metadata: Metadata = {
	title: "Invoices — CashLift",
	description: "Liquid-glass invoice collection cockpit with overdue cash risk and next collections.",
};

export default function Invoices() {
	return <WorkspacePage section="invoices" />;
}
