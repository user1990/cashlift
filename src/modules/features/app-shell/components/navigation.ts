import {
	BanknoteArrowUp,
	ChartSpline,
	ClipboardCheck,
	FileClock,
	LayoutDashboard,
	ReceiptText,
	Settings,
} from "lucide-react";
import type { WorkspaceNavGroup, WorkspaceNavItem } from "./types";

export const DASHBOARD_NAV_ITEM = {
	href: "/app",
	icon: LayoutDashboard,
	label: "Dashboard",
	section: null,
} satisfies WorkspaceNavItem;

export const SETTINGS_NAV_ITEM = {
	href: "/app/settings",
	icon: Settings,
	label: "Settings",
	section: "settings",
} satisfies WorkspaceNavItem;

export const WORKSPACE_NAV_GROUPS = [
	{
		id: "decisions",
		items: [
			{
				href: "/app/approvals",
				icon: ClipboardCheck,
				label: "Approvals",
				section: "approvals",
			},
			{
				href: "/app/budgets",
				icon: BanknoteArrowUp,
				label: "Budgets",
				section: "budgets",
			},
		],
		label: "Decisions",
	},
	{
		id: "cash-ops",
		items: [
			{ href: "/app/cash", icon: ChartSpline, label: "Cash", section: "cash" },
			{
				href: "/app/invoices",
				icon: FileClock,
				label: "Invoices",
				section: "invoices",
			},
			{
				href: "/app/vendors",
				icon: ReceiptText,
				label: "Vendors",
				section: "vendors",
			},
		],
		label: "Cash ops",
	},
] satisfies WorkspaceNavGroup[];
