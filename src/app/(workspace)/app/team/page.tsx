import type { Metadata } from "next";
import { WorkspacePage } from "@/modules/page-shell/components/WorkspacePage";

export const metadata: Metadata = {
	title: "Team — CashLift",
};

export default function Team() {
	return <WorkspacePage section="team" />;
}
