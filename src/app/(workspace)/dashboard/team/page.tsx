import type { Metadata } from "next";
import { WorkspacePage } from "@/modules/page-shell/components/WorkspacePage";

export const metadata: Metadata = {
	title: "Team — CashLift",
	description: "Company members, roles, and teams in this company workspace.",
};

export default function Team() {
	return <WorkspacePage section="team" />;
}
