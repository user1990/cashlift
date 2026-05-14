import { ChevronDown } from "lucide-react";
import * as m from "motion/react-m";
import Link from "next/link";
import { cn } from "@/modules/ui/utils/cn";
import { DASHBOARD_NAV_ITEM, SETTINGS_NAV_ITEM, WORKSPACE_NAV_GROUPS } from "./navigation";
import type { WorkspaceNavGroup, WorkspaceNavItem, WorkspaceSection } from "./types";

type WorkspaceSidebarProps = {
	activeGroupId: WorkspaceNavGroup["id"] | undefined;
	companyName: string;
	openGroupIds: Set<WorkspaceNavGroup["id"]>;
	reducedMotion: boolean | null;
	section: WorkspaceSection;
	toggleGroup: (groupId: WorkspaceNavGroup["id"]) => void;
};

export const WorkspaceSidebar = ({
	activeGroupId,
	companyName,
	openGroupIds,
	reducedMotion,
	section,
	toggleGroup,
}: WorkspaceSidebarProps) => (
	<aside className="rounded-lg border border-shell-border bg-shell-elevated p-3 shadow-shell lg:sticky lg:top-5 lg:self-start">
		<Link href="/" className="block p-2">
			<p className="text-s+ uppercase tracking-normal text-primary">CashLift</p>

			<p className="text-xl+ text-shell-foreground">{companyName}</p>
		</Link>

		<nav className="mt-4 grid gap-1" aria-label="Workspace">
			<WorkspaceNavLink active={false} item={DASHBOARD_NAV_ITEM} reducedMotion={reducedMotion} />

			{WORKSPACE_NAV_GROUPS.map((group) => (
				<WorkspaceNavGroupBlock
					key={group.id}
					active={group.id === activeGroupId}
					group={group}
					open={openGroupIds.has(group.id)}
					reducedMotion={reducedMotion}
					section={section}
					toggleGroup={toggleGroup}
				/>
			))}

			<WorkspaceNavLink
				active={SETTINGS_NAV_ITEM.section === section}
				item={SETTINGS_NAV_ITEM}
				reducedMotion={reducedMotion}
			/>
		</nav>
	</aside>
);

type WorkspaceNavGroupBlockProps = {
	active: boolean;
	group: WorkspaceNavGroup;
	open: boolean;
	reducedMotion: boolean | null;
	section: WorkspaceSection;
	toggleGroup: (groupId: WorkspaceNavGroup["id"]) => void;
};

const WorkspaceNavGroupBlock = ({
	active,
	group,
	open,
	reducedMotion,
	section,
	toggleGroup,
}: WorkspaceNavGroupBlockProps) => (
	<div className="grid gap-1">
		<button
			aria-expanded={open}
			className={cn(
				"flex w-full items-center justify-between rounded-md px-2 py-2 text-m font-medium transition-colors duration-150 ease",
				active ? "text-primary" : "text-shell-muted hover:bg-panel/10 hover:text-shell-foreground",
			)}
			onClick={() => toggleGroup(group.id)}
			type="button"
		>
			<span>{group.label}</span>

			<ChevronDown aria-hidden className={cn("size-4 transition-transform duration-150 ease", open && "rotate-180")} />
		</button>

		{open && (
			<div className="grid gap-1 border-l border-shell-border pl-2">
				{group.items.map((item) => (
					<WorkspaceNavLink
						key={item.href}
						active={item.section === section}
						item={item}
						reducedMotion={reducedMotion}
					/>
				))}
			</div>
		)}
	</div>
);

type WorkspaceNavLinkProps = {
	active: boolean;
	item: WorkspaceNavItem;
	reducedMotion: boolean | null;
};

const WorkspaceNavLink = ({ active, item, reducedMotion }: WorkspaceNavLinkProps) => {
	const Icon = item.icon;

	return (
		<Link aria-current={active ? "page" : undefined} className={getWorkspaceNavLinkClassName(active)} href={item.href}>
			<WorkspaceActiveIndicator active={active} reducedMotion={reducedMotion} />

			<Icon aria-hidden className="relative z-10 size-4" />

			<span className="relative z-10">{item.label}</span>
		</Link>
	);
};

const WorkspaceActiveIndicator = ({ active, reducedMotion }: { active: boolean; reducedMotion: boolean | null }) => {
	if (!active) {
		return null;
	}

	return (
		<m.span
			className="absolute inset-0 rounded-md bg-primary/10"
			layoutId="workspace-nav-active"
			transition={getWorkspaceNavActiveTransition(reducedMotion)}
		/>
	);
};

const getWorkspaceNavLinkClassName = (active: boolean) =>
	cn(
		"relative flex items-center gap-2 overflow-hidden rounded-md px-2 py-2 text-m font-medium transition-colors duration-150 ease",
		active ? "text-primary" : "text-shell-muted hover:bg-panel/10 hover:text-shell-foreground",
	);

const getWorkspaceNavActiveTransition = (reducedMotion: boolean | null) => {
	if (reducedMotion) {
		return { duration: 0 } as const;
	}

	return {
		duration: 0.2,
		ease: "easeInOut",
		type: "tween",
	} as const;
};
