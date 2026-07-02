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

export const WORKSPACE_NAV_ITEMS = [
	{
		href: "/dashboard",
		icon: Home,
		label: "Overview",
		priority: true,
		section: "overview",
	},
	{
		href: "/dashboard/cash",
		icon: BarChart3,
		label: "Cash Insights",
		section: "cash",
	},
	{
		href: "/dashboard/invoices",
		icon: FileText,
		label: "Invoices",
		section: "invoices",
	},
	{
		href: "/dashboard/vendors",
		icon: ReceiptText,
		label: "Vendors",
		priority: true,
		section: "vendors",
	},
	{
		href: "/dashboard/budgets",
		icon: WalletCards,
		label: "Budgets",
		section: "budgets",
	},
	{
		href: "/dashboard/approvals",
		icon: ClipboardCheck,
		label: "Approvals",
		priority: true,
		section: "approvals",
	},
	{
		href: "/dashboard/team",
		icon: UsersRound,
		label: "Team",
		section: "team",
	},
	{
		href: "/dashboard/settings",
		icon: Settings,
		label: "Settings",
		section: "settings",
	},
] as const satisfies readonly WorkspaceNavItem[];
