import dynamic from "next/dynamic";
import { Overview } from "@/modules/dashboard/components/Overview";
import type { WorkspaceDatasetDateRange } from "@/modules/workspace/types";
import type { WorkspacePageRendererProps } from "../types";
import { getWorkspaceExperienceContract } from "../workspaceExperience";

const WorkspaceSectionPage = dynamic(() => import("./WorkspaceSectionPage").then((mod) => mod.WorkspaceSectionPage));

type WorkspacePageViewProps = WorkspacePageRendererProps & {
	dateRange?: WorkspaceDatasetDateRange;
	onDateRangeChange?: (dateRange: WorkspaceDatasetDateRange) => void;
};

export const WorkspacePageView = ({
	dataset,
	dateRange,
	experience,
	onDateRangeChange,
	section,
}: WorkspacePageViewProps) => {
	const overview = section === "overview";
	const workspace = getWorkspaceExperienceContract(experience);

	return overview ? (
		<Overview
			basePath={workspace.basePath}
			dataset={dataset}
			dateRange={dateRange}
			onDateRangeChange={onDateRangeChange}
			readOnly={workspace.readOnly}
		/>
	) : (
		<WorkspaceSectionPage
			basePath={workspace.basePath}
			dataset={dataset}
			readOnly={workspace.readOnly}
			section={section}
		/>
	);
};
