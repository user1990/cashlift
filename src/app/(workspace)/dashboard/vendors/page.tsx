import type { Metadata } from "next";
import { WorkspacePage } from "@/modules/page-shell/components/WorkspacePage";

export const metadata: Metadata = {
	title: "Vendors — CashLift",
};

export default function Vendors() {
	return <WorkspacePage section="vendors" />;
}
