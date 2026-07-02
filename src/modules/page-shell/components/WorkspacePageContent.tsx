"use client";

import { Overview } from "@/modules/dashboard/components/Overview";
import { useWorkspaceDatasetQuery } from "@/modules/workspace/query";
import type { FinancialDataset } from "@/modules/workspace/types";
import type { WorkspacePageProps } from "./types";
import { WorkspaceSectionPage } from "./WorkspaceSectionPage";

type WorkspacePageContentProps = WorkspacePageProps & {
	dataset: FinancialDataset;
};

export const WorkspacePageContent = ({ dataset, section }: WorkspacePageContentProps) => {
	const { data: workspaceDataset } = useWorkspaceDatasetQuery(dataset, section);
	const overview = section === "overview";

	return overview ? (
		<Overview dataset={workspaceDataset} />
	) : (
		<WorkspaceSectionPage dataset={workspaceDataset} section={section} />
	);
};
