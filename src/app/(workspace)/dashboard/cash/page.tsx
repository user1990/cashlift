import type { Metadata } from "next";
import { WorkspacePage } from "@/modules/page-shell/components/WorkspacePage";

export const metadata: Metadata = {
	title: "Cash — CashLift",
};

export default function Cash() {
	return <WorkspacePage section="cash" />;
}
