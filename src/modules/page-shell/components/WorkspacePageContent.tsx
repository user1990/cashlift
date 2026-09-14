"use client";

import { Suspense, ViewTransition } from "react";
import type { FinancialDataset } from "@/modules/workspace/types";
import type { WorkspaceExperience, WorkspaceSection } from "../types";
import { AuthenticatedWorkspacePageContent } from "./AuthenticatedWorkspacePageContent";
import { PublicDemoWorkspacePageContent } from "./PublicDemoWorkspacePageContent";
import { WorkspacePageView } from "./WorkspacePageView";

type WorkspacePageContentProps = {
	dataset: FinancialDataset;
	section: WorkspaceSection;
	experience?: WorkspaceExperience;
};

export const WorkspacePageContent = ({ dataset, experience = "production", section }: WorkspacePageContentProps) =>
	experience === "public-demo" ? (
		<Suspense fallback={<WorkspacePageView dataset={dataset} experience={experience} section={section} />}>
			<PublicDemoWorkspacePageContent dataset={dataset} experience={experience} section={section} />
		</Suspense>
	) : (
		<ViewTransition default="none" name="workspace-section" share="auto" update="auto">
			<AuthenticatedWorkspacePageContent dataset={dataset} experience={experience} section={section} />
		</ViewTransition>
	);
