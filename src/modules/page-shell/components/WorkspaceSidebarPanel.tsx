"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import logo from "@/app/logo.svg";
import { getWorkspaceNavGroups, isWorkspaceNavItemActive } from "../navigation";
import type { WorkspaceExperienceContract } from "../types";
import { WorkspaceAccountMenu } from "./WorkspaceAccountMenu";
import { WorkspaceSidebarLink } from "./WorkspaceSidebarLink";

type WorkspaceSidebarPanelProps = {
	onNavigate?: () => void;
	showAccountMenu?: boolean;
	showLogo?: boolean;
	workspace: WorkspaceExperienceContract;
};

export const WorkspaceSidebarPanel = ({
	onNavigate,
	showAccountMenu = true,
	showLogo = true,
	workspace,
}: WorkspaceSidebarPanelProps) => {
	const pathname = usePathname() ?? "";
	const navGroups = getWorkspaceNavGroups(workspace.basePath);

	return (
		<>
			{showLogo && (
				<Link
					aria-label="CashLift workspace home"
					className="flex items-center gap-3 px-2 py-3"
					href={workspace.basePath}
					onClick={onNavigate}
				>
					<Image alt="CashLift Logo" className="h-9 w-auto shrink-0" height={36} priority src={logo} width={186} />
				</Link>
			)}

			{workspace.readOnly && (
				<p className="mx-2 mt-2 rounded-full border border-primary/35 bg-primary/10 px-3 py-1.5 text-center font-medium text-primary text-s+">
					Read-only demo
				</p>
			)}

			<nav aria-label="Workspace" className={showLogo ? "mt-7" : undefined}>
				{navGroups.map((group, groupIndex) => (
					<Fragment key={group.id}>
						{groupIndex > 0 && <div aria-hidden className="my-3 border-white/10 border-t" />}

						<ul className="grid gap-2">
							{group.items.map((item) => (
								<li key={`${group.id}-${item.label}`}>
									<WorkspaceSidebarLink
										active={isWorkspaceNavItemActive(pathname, item.href, workspace.basePath)}
										item={item}
										onNavigate={onNavigate}
									/>
								</li>
							))}
						</ul>
					</Fragment>
				))}
			</nav>

			{showAccountMenu && (
				<div className="mt-auto sm:pt-8">
					<WorkspaceAccountMenu placement="sidebar" workspace={workspace} />
				</div>
			)}
		</>
	);
};
