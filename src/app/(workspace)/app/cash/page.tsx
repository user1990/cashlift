import type { Metadata } from "next";
import { WorkspacePage } from "@/modules/features/app-shell/components/WorkspacePage";

export const metadata: Metadata = {
	title: "Cash — CashLift",
};

export default function Cash() {
	return <WorkspacePage section="cash" />;
}
