"use client";

import { Overview } from "@/modules/dashboard/components/Overview";
import type { FinancialDataset } from "@/modules/workspace/types";
import type { WorkspacePageProps } from "./types";
import { WorkspaceSectionPage } from "./WorkspaceSectionPage";

type WorkspacePageContentProps = WorkspacePageProps & {
	dataset: FinancialDataset;
};

export const WorkspacePageContent = ({ dataset, section }: WorkspacePageContentProps) => {
	const overview = section === "overview";

	return overview ? <Overview dataset={dataset} /> : <WorkspaceSectionPage dataset={dataset} section={section} />;
};
