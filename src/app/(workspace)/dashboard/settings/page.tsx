import type { Metadata } from "next";
import { WorkspacePage } from "@/modules/page-shell/components/WorkspacePage";

export const metadata: Metadata = {
	title: "Settings — CashLift",
};

export default function SettingsPage() {
	return <WorkspacePage section="settings" />;
}
