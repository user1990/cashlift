import Image from "next/image";
import Link from "next/link";
import logo from "@/app/logo.svg";
import { getWorkspaceNavItems } from "../navigation";
import type { WorkspaceExperienceContract, WorkspaceSection } from "../types";
import { WorkspaceAccountMenu } from "./WorkspaceAccountMenu";
import { WorkspaceSidebarLink } from "./WorkspaceSidebarLink";

type WorkspaceSidebarPanelProps = {
	onNavigate?: () => void;
	section: WorkspaceSection;
	showAccountMenu?: boolean;
	showLogo?: boolean;
	workspace: WorkspaceExperienceContract;
};

export const WorkspaceSidebarPanel = ({
	onNavigate,
	section,
	showAccountMenu = true,
	showLogo = true,
	workspace,
}: WorkspaceSidebarPanelProps) => (
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

		<nav aria-label="Workspace" className={showLogo ? "mt-7 grid gap-2" : "grid gap-2"}>
			{getWorkspaceNavItems(workspace.basePath).map(({ section: itemSection, ...item }) => (
				<WorkspaceSidebarLink
					key={itemSection}
					active={itemSection === section}
					item={{ section: itemSection, ...item }}
					onNavigate={onNavigate}
				/>
			))}
		</nav>

		{showAccountMenu && (
			<div className="mt-auto sm:pt-8">
				<WorkspaceAccountMenu placement="sidebar" workspace={workspace} />
			</div>
		)}
	</>
);
