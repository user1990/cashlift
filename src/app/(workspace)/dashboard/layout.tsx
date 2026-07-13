import { MainContent } from "@/modules/page-shell/components/MainContent";
import { WorkspaceShell } from "@/modules/page-shell/components/WorkspaceShell";
import { getWorkspaceRuntimeConfig, workspaceDemoEnabled } from "@/services/env/app";
import { WorkspaceProviders } from "./WorkspaceProviders";

type DashboardLayoutProps = {
	children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
	const config = getWorkspaceRuntimeConfig();
	const content = <WorkspaceShell mode={config.mode}>{children}</WorkspaceShell>;

	if (!config.configured) {
		return <WorkspaceUnavailable message={config.message} />;
	}

	if (workspaceDemoEnabled()) {
		return <WorkspaceProviders>{content}</WorkspaceProviders>;
	}

	return <WorkspaceProviders>{content}</WorkspaceProviders>;
}

const WorkspaceUnavailable = ({ message }: { message: string }) => (
	<MainContent variant="workspace" className="flex items-center justify-center px-4">
		<div className="max-w-md rounded-lg border border-border bg-panel p-6 text-center shadow-panel">
			<p className="text-s+ uppercase tracking-normal text-primary">CashLift</p>

			<h1 className="mt-2 text-4xl+ tracking-normal text-panel-foreground">Workspace unavailable</h1>

			<p className="mt-3 text-m leading-6 text-muted-foreground">{message}</p>
		</div>
	</MainContent>
);
