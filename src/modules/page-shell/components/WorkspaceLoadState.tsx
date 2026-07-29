import { Panel } from "@/ui/components/layout/Panel";
import { PanelHeader } from "@/ui/components/layout/PanelHeader";
import type { WorkspaceSection } from "../types";
import { WorkspaceSectionHeader } from "./WorkspaceSectionHeader";

type WorkspaceLoadStateProps = {
	message: string;
	section: WorkspaceSection;
	title: string;
};

export const WorkspaceLoadState = ({ message, section, title }: WorkspaceLoadStateProps) => (
	<>
		<WorkspaceSectionHeader section={section} />

		<Panel>
			<PanelHeader label="Status" title={title} />

			<p className="text-m leading-6 text-muted-foreground">{message}</p>
		</Panel>
	</>
);
