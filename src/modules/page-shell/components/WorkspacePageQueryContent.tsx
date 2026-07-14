"use client";

import { useState } from "react";
import { useWorkspaceDatasetQuery } from "@/modules/workspace/query";
import { reduceDatasetForDateRange } from "@/modules/workspace/read-models";
import type { WorkspaceDatasetDateRange } from "@/modules/workspace/types";
import { WorkspacePageView } from "./WorkspacePageView";
import type { WorkspacePageRendererProps } from "./workspacePageContentTypes";
import { getForecastDateRange } from "./workspacePageDateRange";

export const WorkspacePageQueryContent = ({ dataset, experience, section }: WorkspacePageRendererProps) => {
	const [overviewDateRange, setOverviewDateRange] = useState<WorkspaceDatasetDateRange | undefined>(() =>
		getForecastDateRange(dataset),
	);
	const dateRange = section === "overview" ? overviewDateRange : undefined;
	const { data: workspaceDataset } = useWorkspaceDatasetQuery(dataset, section, dateRange);
	const visibleDataset =
		section === "overview" ? reduceDatasetForDateRange(workspaceDataset, dateRange) : workspaceDataset;

	return (
		<WorkspacePageView
			dataset={visibleDataset}
			dateRange={dateRange}
			experience={experience}
			onDateRangeChange={setOverviewDateRange}
			section={section}
		/>
	);
};
