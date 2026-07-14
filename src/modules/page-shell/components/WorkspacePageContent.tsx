"use client";

import type { FinancialDataset } from "@/modules/workspace/types";
import { AuthenticatedWorkspacePageContent } from "./AuthenticatedWorkspacePageContent";
import { PublicDemoWorkspacePageContent } from "./PublicDemoWorkspacePageContent";
import type { WorkspaceExperience, WorkspaceSection } from "./types";

type WorkspacePageContentProps = {
	dataset: FinancialDataset;
	section: WorkspaceSection;
	experience?: WorkspaceExperience;
};

export const WorkspacePageContent = ({ dataset, experience = "production", section }: WorkspacePageContentProps) =>
	experience === "public-demo" ? (
		<PublicDemoWorkspacePageContent dataset={dataset} experience={experience} section={section} />
	) : (
		<AuthenticatedWorkspacePageContent dataset={dataset} experience={experience} section={section} />
	);
