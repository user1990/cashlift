import type { Metadata } from "next";
import { WorkspacePage } from "@/modules/page-shell/components/WorkspacePage";

export const metadata: Metadata = {
	title: "Invoices — CashLift",
};

export default function Invoices() {
	return <WorkspacePage section="invoices" />;
}
