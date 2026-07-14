import type { LucideIcon } from "lucide-react";
import type { WorkspaceDatasetScope } from "@/modules/workspace/types";
import type { CashLiftAppMode } from "@/services/env/app";

export type WorkspacePageProps = {
	section: WorkspaceDatasetScope;
};

export type WorkspaceSection = WorkspacePageProps["section"];

export type WorkspaceNavItem = {
	href: string;
	icon: LucideIcon;
	label: string;
	priority?: boolean;
	section: WorkspaceSection;
};

export type WorkspaceExperience = CashLiftAppMode | "public-demo";
