"use client";

import { useWorkspaceDatasetQuery } from "@/modules/workspace/query";
import { reduceDatasetForDateRange } from "@/modules/workspace/read-models";
import { useOverviewDateRangeQueryState } from "./useOverviewDateRangeQueryState";
import { WorkspacePageView } from "./WorkspacePageView";
import type { WorkspacePageRendererProps } from "./workspacePageContentTypes";

export const WorkspacePageQueryContent = ({ dataset, experience, section }: WorkspacePageRendererProps) => {
	const { dateRange: overviewDateRange, setDateRange } = useOverviewDateRangeQueryState(dataset);
	const dateRange = section === "overview" ? overviewDateRange : undefined;
	const { data: workspaceDataset } = useWorkspaceDatasetQuery(dataset, section, dateRange);
	const visibleDataset =
		section === "overview" ? reduceDatasetForDateRange(workspaceDataset, dateRange) : workspaceDataset;

	return (
		<WorkspacePageView
			bufferDataset={dataset}
			dataset={visibleDataset}
			dateRange={dateRange}
			experience={experience}
			onDateRangeChange={setDateRange}
			section={section}
		/>
	);
};
