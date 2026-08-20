import type { WorkspaceExperienceContract, WorkspaceSection } from "../types";
import { WorkspaceSidebarPanel } from "./WorkspaceSidebarPanel";

type WorkspaceSidebarProps = {
	section: WorkspaceSection;
	workspace: WorkspaceExperienceContract;
};

export const WorkspaceSidebar = ({ section, workspace }: WorkspaceSidebarProps) => (
	<aside className="hidden min-h-[calc(100vh-2rem)] flex-col rounded-lg border border-white/5 bg-black/30 p-3 shadow-shell backdrop-blur lg:sticky lg:top-4 lg:flex lg:self-start">
		<WorkspaceSidebarPanel section={section} workspace={workspace} />
	</aside>
);
