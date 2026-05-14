import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { FinancialDataset } from "@/modules/base/finance/types";

export type WorkspacePageProps = {
	section: "approvals" | "cash" | "invoices" | "vendors" | "budgets" | "settings";
};

export type WorkspaceSection = WorkspacePageProps["section"];

export type WorkspaceNavItem = {
	href: string;
	icon: LucideIcon;
	label: string;
	section: WorkspaceSection | null;
};

export type WorkspaceNavGroup = {
	id: "decisions" | "cash-ops";
	items: WorkspaceNavItem[];
	label: string;
};

export type WorkspaceSectionComponent = ({ dataset }: { dataset: FinancialDataset }) => ReactNode;
