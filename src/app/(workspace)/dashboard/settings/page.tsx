import type { Metadata } from "next";
import { WorkspacePage } from "@/modules/page-shell/components/WorkspacePage";

export const metadata: Metadata = {
	title: "Settings — CashLift",
	description:
		"Company workspace configuration, cash guardrails, and operating boundaries in the liquid-glass workspace.",
};

export default function SettingsPage() {
	return <WorkspacePage section="settings" />;
}
