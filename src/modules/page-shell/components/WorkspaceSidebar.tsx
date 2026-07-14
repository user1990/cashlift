"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/app/logo.svg";
import { getWorkspaceNavItems } from "./navigation";
import type { WorkspaceExperience, WorkspaceSection } from "./types";
import { WorkspaceAccountMenu } from "./WorkspaceAccountMenu";
import { WorkspaceSidebarLink } from "./WorkspaceSidebarLink";

type WorkspaceSidebarProps = {
	basePath: string;
	experience: WorkspaceExperience;
	section: WorkspaceSection;
};

export const WorkspaceSidebar = ({ basePath, experience, section }: WorkspaceSidebarProps) => (
	<aside className="flex min-h-[calc(100vh-2rem)] flex-col rounded-lg border border-white/5 bg-black/30 p-3 shadow-shell backdrop-blur lg:sticky lg:top-4 lg:self-start">
		<Link href={basePath} className="flex items-center gap-3 px-2 py-3">
			<Image src={logo} alt="CashLift Logo" width={186} height={36} priority className="h-9 w-auto shrink-0" />
		</Link>

		{experience === "public-demo" && (
			<p className="mx-2 mt-2 rounded-full border border-primary/35 bg-primary/10 px-3 py-1.5 text-center text-s+ font-medium text-primary">
				Read-only demo
			</p>
		)}

		<nav className="mt-7 grid gap-2" aria-label="Workspace">
			{getWorkspaceNavItems(basePath).map((item) => (
				<WorkspaceSidebarLink key={item.section} active={item.section === section} item={item} />
			))}
		</nav>

		<div className="mt-auto sm:pt-8">
			<WorkspaceAccountMenu basePath={basePath} experience={experience} />
		</div>
	</aside>
);
