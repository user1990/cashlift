"use client";

import type { ReactNode } from "react";
import type { WorkspaceExperience } from "../types";
import { getWorkspaceExperienceContract } from "../workspaceExperience";
import { MainContent } from "./MainContent";
import { WorkspaceMobileNav } from "./WorkspaceMobileNav";
import { WorkspaceSidebar } from "./WorkspaceSidebar";

type WorkspaceShellProps = {
	children: ReactNode;
	experience: WorkspaceExperience;
};

export const WorkspaceShell = ({ children, experience }: WorkspaceShellProps) => {
	const workspace = getWorkspaceExperienceContract(experience);

	return (
		<div className="min-h-dvh bg-shell text-shell-foreground">
			<WorkspaceMobileNav workspace={workspace} />

			<div className="mx-auto grid w-full max-w-[1600px] gap-6 p-4 lg:grid-cols-[236px_1fr]">
				<WorkspaceSidebar workspace={workspace} />

				<MainContent variant="plain" className="min-w-0 space-y-5">
					{children}
				</MainContent>
			</div>
		</div>
	);
};
