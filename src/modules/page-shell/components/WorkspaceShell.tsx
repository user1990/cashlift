"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { MainContent } from "./MainContent";
import { WORKSPACE_NAV_ITEMS } from "./navigation";
import type { WorkspaceMode, WorkspaceSection } from "./types";
import { WorkspaceSidebar } from "./WorkspaceSidebar";

type WorkspaceShellProps = {
	children: ReactNode;
	mode: WorkspaceMode;
};

export const WorkspaceShell = ({ children, mode }: WorkspaceShellProps) => {
	const section = useActiveWorkspaceSection();

	return (
		<MainContent variant="workspace">
			<div className="mx-auto grid w-full max-w-[1600px] gap-6 p-4 lg:grid-cols-[236px_1fr]">
				<WorkspaceSidebar mode={mode} section={section} />

				<section className="min-w-0 space-y-5">{children}</section>
			</div>
		</MainContent>
	);
};

function useActiveWorkspaceSection(): WorkspaceSection {
	const pathname = usePathname();
	const activeItem = WORKSPACE_NAV_ITEMS.find(
		({ href }) => pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`)),
	);

	return activeItem?.section ?? "overview";
}
