import type { Metadata } from "next";
import { WorkspacePage } from "@/modules/page-shell/components/WorkspacePage";

export const metadata: Metadata = {
	title: "Approvals — CashLift",
};

export default function Approvals() {
	return <WorkspacePage section="approvals" />;
}
