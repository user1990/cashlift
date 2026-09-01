import { GlassCard } from "@/modules/dashboard/explore/GlassCard";
import { Panel } from "@/ui/components/layout/Panel";
import { PanelHeader } from "@/ui/components/layout/PanelHeader";
import type { WorkspaceSection } from "../types";
import { WorkspaceSectionHeader } from "./WorkspaceSectionHeader";

type WorkspacePageLoadingProps = {
	section: WorkspaceSection;
};

export const WorkspacePageLoading = ({ section }: WorkspacePageLoadingProps) =>
	section === "approvals" ? <ApprovalsPageLoading /> : <DefaultWorkspacePageLoading section={section} />;

function ApprovalsPageLoading() {
	return (
		<div className="space-y-4 xl:space-y-5">
			<GlassCard atmosphere="status">
				<p className="text-muted-foreground text-s">Workspace · Spend approvals</p>

				<h1 className="mt-3 font-semibold text-3xl+ text-panel-foreground tracking-normal">Spend approvals</h1>

				<div aria-hidden className="mt-6 grid gap-5 sm:grid-cols-3">
					<div className="h-16 rounded-lg bg-white/10" />

					<div className="h-16 rounded-lg bg-white/10" />

					<div className="h-16 rounded-lg bg-white/10" />
				</div>
			</GlassCard>

			<section className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:gap-5">
				<GlassCard atmosphere="priority" intensity="active">
					<p className="text-muted-foreground text-s">Priority</p>

					<div aria-hidden className="mt-4 space-y-3">
						<div className="h-8 rounded-lg bg-white/10" />

						<div className="h-16 rounded-lg bg-white/10" />
					</div>
				</GlassCard>

				<GlassCard atmosphere="queue">
					<p className="text-muted-foreground text-s">Queue</p>

					<div aria-hidden className="mt-4 space-y-3">
						<div className="h-14 rounded-lg bg-white/10" />

						<div className="h-14 rounded-lg bg-white/10" />
					</div>
				</GlassCard>
			</section>
		</div>
	);
}

function DefaultWorkspacePageLoading({ section }: WorkspacePageLoadingProps) {
	return (
		<>
			<WorkspaceSectionHeader section={section} />

			<div className="grid gap-4 xl:grid-cols-[1fr_0.7fr]">
				<Panel>
					<PanelHeader label="Loading" title="Preparing workspace data" />

					<div aria-hidden className="space-y-3">
						<div className="h-14 rounded-lg bg-panel-muted" />

						<div className="h-14 rounded-lg bg-panel-muted" />

						<div className="h-14 rounded-lg bg-panel-muted" />
					</div>
				</Panel>

				<Panel>
					<PanelHeader label="CashLift" title="Keeping the shell ready" />

					<div aria-hidden className="space-y-3">
						<div className="h-4 rounded bg-panel-muted" />

						<div className="h-4 w-4/5 rounded bg-panel-muted" />

						<div className="h-4 w-2/3 rounded bg-panel-muted" />
					</div>
				</Panel>
			</div>
		</>
	);
}
