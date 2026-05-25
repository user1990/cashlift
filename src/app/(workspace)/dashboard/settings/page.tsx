import type { Metadata } from "next";
import { WorkspacePage } from "@/modules/page-shell/components/WorkspacePage";

export const metadata: Metadata = {
	title: "Settings — Kuvro",
};

export default function SettingsPage() {
	return <WorkspacePage section="settings" />;
}
