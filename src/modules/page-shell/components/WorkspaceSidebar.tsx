"use client";

import Link from "next/link";
import { WORKSPACE_NAV_ITEMS } from "./navigation";
import type { WorkspaceMode, WorkspaceSection } from "./types";
import { WorkspaceAccountMenu } from "./WorkspaceAccountMenu";
import { WorkspaceNavLink } from "./WorkspaceNavLink";

type WorkspaceSidebarProps = {
	mode: WorkspaceMode;
	section: WorkspaceSection;
};

export const WorkspaceSidebar = ({ mode, section }: WorkspaceSidebarProps) => (
	<aside className="flex min-h-[calc(100vh-2rem)] flex-col rounded-lg border border-white/5 bg-black/30 p-3 shadow-shell backdrop-blur lg:sticky lg:top-4 lg:self-start">
		<Link href="/dashboard" className="flex items-center gap-3 px-2 py-3">
			<span className="grid size-10 place-items-center rounded-lg bg-signal-subtle text-signal shadow-primary-glow">
				<span className="size-6 rounded-[6px] bg-signal [clip-path:polygon(50%_0,100%_100%,50%_78%,0_100%)]" />
			</span>

			<span className="text-2xl+ font-semibold tracking-normal text-shell-foreground">
				Cash<span className="text-signal">Lift</span>
			</span>
		</Link>

		<nav className="mt-7 grid gap-2" aria-label="Workspace">
			{WORKSPACE_NAV_ITEMS.map((item) => (
				<WorkspaceNavLink key={item.href} active={item.section === section} item={item} />
			))}
		</nav>

		<div className="mt-auto sm:pt-8">
			<WorkspaceAccountMenu mode={mode} />
		</div>
	</aside>
);
