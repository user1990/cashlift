"use client";

import Link from "next/link";
import { CashLiftLogo } from "@/ui/components/brand/CashLiftLogo";
import { getWorkspaceNavItems } from "../navigation";
import type { WorkspaceExperienceContract, WorkspaceSection } from "../types";
import { WorkspaceAccountMenu } from "./WorkspaceAccountMenu";
import { WorkspaceSidebarLink } from "./WorkspaceSidebarLink";

type WorkspaceSidebarProps = {
	section: WorkspaceSection;
	workspace: WorkspaceExperienceContract;
};

export const WorkspaceSidebar = ({ section, workspace }: WorkspaceSidebarProps) => (
	<aside className="flex min-h-[calc(100vh-2rem)] flex-col rounded-lg border border-white/5 bg-black/30 p-3 shadow-shell backdrop-blur lg:sticky lg:top-4 lg:self-start">
		<Link aria-label="CashLift workspace home" href={workspace.basePath} className="flex items-center gap-3 px-2 py-3">
			<CashLiftLogo className="h-6 w-auto shrink-0" />
		</Link>

		{workspace.readOnly && (
			<p className="mx-2 mt-2 rounded-full border border-primary/35 bg-primary/10 px-3 py-1.5 text-center font-medium text-primary text-s+">
				Read-only demo
			</p>
		)}

		<nav className="mt-7 grid gap-2" aria-label="Workspace">
			{getWorkspaceNavItems(workspace.basePath).map(({ section: itemSection, ...item }) => (
				<WorkspaceSidebarLink
					key={itemSection}
					active={itemSection === section}
					item={{ section: itemSection, ...item }}
				/>
			))}
		</nav>

		<div className="mt-auto sm:pt-8">
			<WorkspaceAccountMenu workspace={workspace} />
		</div>
	</aside>
);
