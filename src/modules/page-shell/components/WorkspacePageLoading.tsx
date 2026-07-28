import { Panel, PanelHeader } from "@/ui/components/Panel";
import type { WorkspaceSection } from "../types";
import { WorkspaceSectionHeader } from "./WorkspaceSectionHeader";

type WorkspacePageLoadingProps = {
	section: WorkspaceSection;
};

export const WorkspacePageLoading = ({ section }: WorkspacePageLoadingProps) => (
	<>
		<WorkspaceSectionHeader section={section} />

		<div className="grid gap-4 xl:grid-cols-[1fr_0.7fr]">
			<Panel>
				<PanelHeader label="Loading" title="Preparing workspace data" />

				<div className="space-y-3" aria-hidden>
					<div className="h-14 rounded-lg bg-panel-muted" />

					<div className="h-14 rounded-lg bg-panel-muted" />

					<div className="h-14 rounded-lg bg-panel-muted" />
				</div>
			</Panel>

			<Panel>
				<PanelHeader label="CashLift" title="Keeping the shell ready" />

				<div className="space-y-3" aria-hidden>
					<div className="h-4 rounded bg-panel-muted" />

					<div className="h-4 w-4/5 rounded bg-panel-muted" />

					<div className="h-4 w-2/3 rounded bg-panel-muted" />
				</div>
			</Panel>
		</div>
	</>
);
