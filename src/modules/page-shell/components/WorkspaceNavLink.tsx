import Link from "next/link";
import { cn } from "@/ui/utils/cn";
import type { WorkspaceNavItem } from "./types";

type WorkspaceNavLinkProps = {
	item: WorkspaceNavItem;
	active?: boolean;
};

export const WorkspaceNavLink = ({ active = false, item }: WorkspaceNavLinkProps) => {
	const Icon = item.icon;

	return (
		<Link aria-current={active ? "page" : undefined} href={item.href} className={getWorkspaceNavLinkClassName(active)}>
			<WorkspaceActiveIndicator active={active} />

			<Icon aria-hidden className="relative z-10 size-5" />

			<span className="relative z-10">{item.label}</span>
		</Link>
	);
};

const WorkspaceActiveIndicator = ({ active = false }: { active?: boolean }) => {
	if (!active) {
		return null;
	}

	return <span className="absolute inset-0 rounded-lg border border-primary-subtle-border bg-primary/10" />;
};

const getWorkspaceNavLinkClassName = (active: boolean) =>
	cn(
		"relative flex min-h-12 items-center gap-3 overflow-hidden rounded-lg px-4 text-m font-medium transition-colors duration-150 ease",
		active ? "text-primary" : "text-shell-muted hover:bg-white/5 hover:text-shell-foreground",
	);
