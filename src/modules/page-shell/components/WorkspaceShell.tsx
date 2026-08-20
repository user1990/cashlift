"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { getWorkspaceNavItems } from "../navigation";
import type { WorkspaceExperience, WorkspaceSection } from "../types";
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
	const section = useActiveWorkspaceSection(workspace.basePath);

	return (
		<MainContent variant="workspace">
			<WorkspaceMobileNav section={section} workspace={workspace} />

			<div className="mx-auto grid w-full max-w-[1600px] gap-6 p-4 lg:grid-cols-[236px_1fr]">
				<WorkspaceSidebar section={section} workspace={workspace} />

				<section className="min-w-0 space-y-5">{children}</section>
			</div>
		</MainContent>
	);
};

function useActiveWorkspaceSection(basePath: string): WorkspaceSection {
	const pathname = usePathname() ?? "";
	const activeItem = getWorkspaceNavItems(basePath).find(
		({ href }) => pathname === href || (href !== basePath && pathname.startsWith(`${href}/`)),
	);

	return activeItem?.section ?? "overview";
}
