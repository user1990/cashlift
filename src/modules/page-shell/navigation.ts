import {
	BarChart3,
	ClipboardCheck,
	FileText,
	Home,
	ReceiptText,
	Settings,
	UsersRound,
	WalletCards,
} from "lucide-react";
import type { WorkspaceNavItem } from "./types";

const WORKSPACE_NAV_ITEMS = [
	{
		icon: Home,
		label: "Overview",
		priority: true,
		section: "overview",
	},
	{
		icon: BarChart3,
		label: "Cash Insights",
		section: "cash",
	},
	{
		icon: FileText,
		label: "Invoices",
		section: "invoices",
	},
	{
		icon: ReceiptText,
		label: "Vendors",
		priority: true,
		section: "vendors",
	},
	{
		icon: WalletCards,
		label: "Budgets",
		section: "budgets",
	},
	{
		icon: ClipboardCheck,
		label: "Approvals",
		priority: true,
		section: "approvals",
	},
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
] as const satisfies readonly Omit<WorkspaceNavItem, "href">[];

export const getWorkspaceNavItems = (basePath: string): WorkspaceNavItem[] =>
	WORKSPACE_NAV_ITEMS.map((item) => ({
		...item,
		href: item.section === "overview" ? basePath : `${basePath}/${item.section}`,
	}));
