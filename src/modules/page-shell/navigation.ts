import {
	BarChart3,
	CircleDollarSign,
	ClipboardCheck,
	FileText,
	Home,
	ReceiptText,
	Settings,
	TrendingUp,
	UsersRound,
	WalletCards,
} from "lucide-react";
import type { WorkspaceNavGroup, WorkspaceNavItem, WorkspaceNavItemDefinition, WorkspaceSection } from "./types";

const WORKSPACE_NAV_GROUPS = [
	{
		id: "home",
		items: [
			{
				icon: Home,
				label: "Overview",
				priority: true,
				section: "overview",
			},
		],
	},
	{
		id: "cash",
		items: [
			{
				icon: BarChart3,
				label: "Cash Insights",
				section: "cash",
			},
			{
				icon: TrendingUp,
				label: "13-week Outlook",
				section: "overview",
			},
		],
	},
	{
		id: "receivables",
		items: [
			{
				icon: FileText,
				label: "Invoices",
				priority: true,
				section: "invoices",
			},
			{
				icon: CircleDollarSign,
				label: "Overdue collections",
				section: "invoices",
			},
		],
	},
	{
		id: "spend",
		items: [
			{
				icon: ClipboardCheck,
				label: "Spend approvals",
				priority: true,
				section: "approvals",
			},
			{
				icon: ReceiptText,
				label: "Vendor bills & leaks",
				priority: true,
				section: "vendors",
			},
			{
				icon: WalletCards,
				label: "Team budgets",
				section: "budgets",
			},
		],
	},
	{
		id: "company",
		items: [
			{
				icon: UsersRound,
				label: "Team",
				section: "team",
			},
			{
				icon: Settings,
				label: "Settings",
				section: "settings",
			},
		],
	},
] as const satisfies readonly WorkspaceNavGroupDefinition[];

type WorkspaceNavGroupDefinition = {
	id: string;
	items: readonly WorkspaceNavItemDefinition[];
};

export const getWorkspaceNavGroups = (basePath: string): WorkspaceNavGroup[] =>
	WORKSPACE_NAV_GROUPS.map((group) => ({
		id: group.id,
		items: group.items
			.filter((item) => item.visible?.(basePath) ?? true)
			.map((item) => buildWorkspaceNavItem(basePath, item)),
	})).filter((group) => group.items.length > 0);

export const getWorkspaceNavItems = (basePath: string): WorkspaceNavItem[] =>
	getWorkspaceNavGroups(basePath).flatMap((group) => group.items);

export const getActiveWorkspaceNavItem = (pathname: string, basePath: string): WorkspaceNavItem | undefined => {
	const matches = getWorkspaceNavItems(basePath).filter(
		({ href }) => pathname === href || (href !== basePath && pathname.startsWith(`${href}/`)),
	);

	return matches.sort((left, right) => right.href.length - left.href.length)[0];
};

export const getActiveWorkspaceSection = (pathname: string, basePath: string): WorkspaceSection =>
	getActiveWorkspaceNavItem(pathname, basePath)?.section ?? "overview";

export const isWorkspaceNavItemActive = (pathname: string, href: string, basePath: string): boolean =>
	getActiveWorkspaceNavItem(pathname, basePath)?.href === href;

const buildWorkspaceNavItem = (basePath: string, item: WorkspaceNavItemDefinition): WorkspaceNavItem => ({
	...item,
	href: resolveWorkspaceNavHref(basePath, item),
});

const resolveWorkspaceNavHref = (basePath: string, item: WorkspaceNavItemDefinition): string => {
	if (item.path) {
		return `${basePath}/${item.path}`;
	}

	if (item.section === "overview") {
		return basePath;
	}

	return `${basePath}/${item.section}`;
};
