import type { WorkspaceExperienceContract } from "../types";
import { WorkspaceSidebarPanel } from "./WorkspaceSidebarPanel";

type WorkspaceSidebarProps = {
	workspace: WorkspaceExperienceContract;
};

export const WorkspaceSidebar = ({ workspace }: WorkspaceSidebarProps) => (
	<aside className="hidden min-h-[calc(100vh-2rem)] flex-col rounded-lg border border-white/5 bg-black/30 p-3 shadow-shell backdrop-blur lg:sticky lg:top-4 lg:flex lg:self-start">
		<WorkspaceSidebarPanel workspace={workspace} />
	</aside>
);
