"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/app/logo.svg";
import { WORKSPACE_NAV_ITEMS } from "./navigation";
import type { WorkspaceMode, WorkspaceSection } from "./types";
import { WorkspaceAccountMenu } from "./WorkspaceAccountMenu";
import { WorkspaceSidebarLink } from "./WorkspaceSidebarLink";

type WorkspaceSidebarProps = {
	mode: WorkspaceMode;
	section: WorkspaceSection;
};

export const WorkspaceSidebar = ({ mode, section }: WorkspaceSidebarProps) => (
	<aside className="flex min-h-[calc(100vh-2rem)] flex-col rounded-lg border border-white/5 bg-black/30 p-3 shadow-shell backdrop-blur lg:sticky lg:top-4 lg:self-start">
		<Link href="/dashboard" className="flex items-center gap-3 px-2 py-3">
			<Image src={logo} alt="CashLift Logo" width={140} height={40} priority className="h-10 w-auto shrink-0" />
		</Link>

		<nav className="mt-7 grid gap-2" aria-label="Workspace">
			{WORKSPACE_NAV_ITEMS.map((item) => (
				<WorkspaceSidebarLink key={item.href} active={item.section === section} item={item} />
			))}
		</nav>

		<div className="mt-auto sm:pt-8">
			<WorkspaceAccountMenu mode={mode} />
		</div>
	</aside>
);
