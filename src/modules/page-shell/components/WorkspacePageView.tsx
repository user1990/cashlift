import { Overview } from "@/modules/dashboard/components/Overview";
import type { WorkspaceDatasetDateRange } from "@/modules/workspace/types";
import { WorkspaceSectionPage } from "./WorkspaceSectionPage";
import { getWorkspaceExperienceContract } from "./workspaceExperience";
import type { WorkspacePageRendererProps } from "./workspacePageContentTypes";

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
		<WorkspaceSectionPage dataset={dataset} readOnly={workspace.readOnly} section={section} />
	);
};
