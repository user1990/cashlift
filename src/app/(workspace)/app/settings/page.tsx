import type { Metadata } from "next";
import { WorkspacePage } from "@/modules/features/app-shell/components/WorkspacePage";

export const metadata: Metadata = {
	title: "Settings — CashLift",
};

export default function SettingsPage() {
	return <WorkspacePage section="settings" />;
}
