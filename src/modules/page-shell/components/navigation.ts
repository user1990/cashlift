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
		href: "/app",
		icon: Home,
		label: "Overview",
		section: "overview",
	},
	{
		href: "/app/cash",
		icon: BarChart3,
		label: "Cash Insights",
		section: "cash",
	},
	{
		href: "/app/invoices",
		icon: FileText,
		label: "Invoices",
		section: "invoices",
	},
	{
		href: "/app/vendors",
		icon: ReceiptText,
		label: "Vendors",
		section: "vendors",
	},
	{
		href: "/app/budgets",
		icon: WalletCards,
		label: "Budgets",
		section: "budgets",
	},
	{
		href: "/app/approvals",
		icon: ClipboardCheck,
		label: "Approvals",
		section: "approvals",
	},
	{
		href: "/app/team",
		icon: UsersRound,
		label: "Team",
		section: "team",
	},
	{
		href: "/app/settings",
		icon: Settings,
		label: "Settings",
		section: "settings",
	},
] as const satisfies readonly WorkspaceNavItem[];
