import type { Metadata } from "next";
import { WorkspaceProviders } from "@/modules/page-shell/components/WorkspaceProviders";
import { WorkspaceShell } from "@/modules/page-shell/components/WorkspaceShell";

export const metadata: Metadata = {
	description: "Explore CashLift's ranked cash action inbox in a static, read-only Studio Nova workspace.",
	title: "Live product demo — CashLift",
};

type DemoWorkspaceLayoutProps = {
	children: React.ReactNode;
};

export default function DemoWorkspaceLayout({ children }: DemoWorkspaceLayoutProps) {
	return (
		<WorkspaceProviders authEnabled={false}>
			<WorkspaceShell experience="public-demo">{children}</WorkspaceShell>
		</WorkspaceProviders>
	);
}
