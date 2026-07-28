"use client";

import { reduceDatasetForDateRange } from "@/modules/workspace/read-models";
import { useOverviewDateRangeQueryState } from "../hooks/useOverviewDateRangeQueryState";
import type { WorkspacePageRendererProps } from "../types";
import { WorkspacePageView } from "./WorkspacePageView";

export const PublicDemoWorkspacePageContent = ({ dataset, experience, section }: WorkspacePageRendererProps) => {
	const { dateRange: overviewDateRange, setDateRange } = useOverviewDateRangeQueryState(dataset);
	const dateRange = section === "overview" ? overviewDateRange : undefined;
	const visibleDataset = section === "overview" ? reduceDatasetForDateRange(dataset, dateRange) : dataset;

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
