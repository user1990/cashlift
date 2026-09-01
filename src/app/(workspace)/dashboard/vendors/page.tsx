import type { Metadata } from "next";
import { WorkspacePage } from "@/modules/page-shell/components/WorkspacePage";

export const metadata: Metadata = {
	title: "Vendor bills & leaks — CashLift",
	description: "Review vendor bills and subscription leaks in the liquid-glass workspace cockpit.",
};

export default function Vendors() {
	return <WorkspacePage section="vendors" />;
}
