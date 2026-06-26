import type { Metadata } from "next";
import { WorkspacePage } from "@/modules/page-shell/components/WorkspacePage";

export const metadata: Metadata = {
	title: "Budgets — CashLift",
};

export default function Budgets() {
	return <WorkspacePage section="budgets" />;
}
