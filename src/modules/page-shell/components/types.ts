import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { FinancialDataset, WorkspaceDatasetScope } from "@/modules/workspace/types";
import type { CashLiftAppMode } from "@/services/env/app";

export type WorkspacePageProps = {
	section: WorkspaceDatasetScope;
};

export type WorkspaceSection = WorkspacePageProps["section"];

export type WorkspaceNavItem = {
	href: string;
	icon: LucideIcon;
	label: string;
	section: WorkspaceSection;
};

export type WorkspaceSectionComponent = ({ dataset }: { dataset: FinancialDataset }) => ReactNode;

export type WorkspaceMode = CashLiftAppMode;
