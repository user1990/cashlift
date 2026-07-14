"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { MainContent } from "./MainContent";
import { getWorkspaceNavItems } from "./navigation";
import type { WorkspaceExperience, WorkspaceSection } from "./types";
import { WorkspaceSidebar } from "./WorkspaceSidebar";

type WorkspaceShellProps = {
	children: ReactNode;
	experience: WorkspaceExperience;
};

export const WorkspaceShell = ({ children, experience }: WorkspaceShellProps) => {
	const basePath = experience === "public-demo" ? "/demo/workspace" : "/dashboard";
	const section = useActiveWorkspaceSection(basePath);

	return (
		<MainContent variant="workspace">
			<div className="mx-auto grid w-full max-w-[1600px] gap-6 p-4 lg:grid-cols-[236px_1fr]">
				<WorkspaceSidebar basePath={basePath} experience={experience} section={section} />

				<section className="min-w-0 space-y-5">{children}</section>
			</div>
		</MainContent>
	);
};

function useActiveWorkspaceSection(basePath: string): WorkspaceSection {
	const pathname = usePathname();
	const activeItem = getWorkspaceNavItems(basePath).find(
		({ href }) => pathname === href || (href !== basePath && pathname.startsWith(`${href}/`)),
	);

	return activeItem?.section ?? "overview";
}
