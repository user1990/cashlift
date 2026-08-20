import type { LucideIcon } from "lucide-react";
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
	priority?: boolean;
};

export type WorkspaceNavItemDefinition = {
	icon: LucideIcon;
	label: string;
	path?: string;
	priority?: boolean;
	section: WorkspaceSection;
	visible?: (basePath: string) => boolean;
};

export type WorkspaceNavGroup = {
	id: string;
	items: WorkspaceNavItem[];
};

export type WorkspaceExperience = CashLiftAppMode | "public-demo";

export type WorkspaceExperienceContract = {
	basePath: "/dashboard" | "/demo/workspace";
	experience: WorkspaceExperience;
	readOnly: boolean;
};

export type WorkspacePageRendererProps = {
	dataset: FinancialDataset;
	experience: WorkspaceExperience;
	section: WorkspaceSection;
};
