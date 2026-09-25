"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import logo from "@/ui/assets/logo.svg";
import { getActiveWorkspaceNavHref, getWorkspaceNavGroups } from "../navigation";
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
	const activeHref = getActiveWorkspaceNavHref(pathname, workspace.basePath);
	const logoLink = showLogo ? (
		<Link
			aria-label="CashLift workspace home"
			className="flex items-center gap-3 px-2 py-3"
			href={workspace.basePath}
			onClick={onNavigate}
		>
			<Image alt="CashLift Logo" className="h-9 w-auto shrink-0" height={36} priority src={logo} width={186} />
		</Link>
	) : undefined;
	const readOnlyBanner = workspace.readOnly ? (
		<p className="mx-2 mt-2 rounded-full border border-shell-border bg-shell-elevated/60 px-3 py-1.5 text-center font-medium text-s+ text-shell-muted">
			Read-only demo
		</p>
	) : undefined;
	const accountMenu = showAccountMenu ? (
		<div className="mt-auto sm:pt-8">
			<WorkspaceAccountMenu placement="sidebar" workspace={workspace} />
		</div>
	) : undefined;

	return (
		<>
			{logoLink}

			{readOnlyBanner}

			<nav aria-label="Workspace" className={showLogo ? "mt-7" : undefined}>
				{navGroups.map((group, groupIndex) => (
					<Fragment key={group.id}>
						{groupIndex > 0 && <div aria-hidden className="my-3 border-white/10 border-t" />}

						<ul className="grid gap-2">
							{group.items.map((item) => (
								<li key={`${group.id}-${item.label}`}>
									<WorkspaceSidebarLink active={item.href === activeHref} item={item} onNavigate={onNavigate} />
								</li>
							))}
						</ul>
					</Fragment>
				))}
			</nav>

			{accountMenu}
		</>
	);
};
