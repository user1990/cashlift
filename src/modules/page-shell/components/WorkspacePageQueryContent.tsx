"use client";

import { isPermanentWorkspaceDatasetError, useWorkspaceDatasetQuery } from "@/modules/workspace/query";
import { reduceDatasetForDateRange } from "@/modules/workspace/read-models";
import { Button } from "@/ui/components/actions/Button";
import { Panel } from "@/ui/components/layout/Panel";
import { PanelHeader } from "@/ui/components/layout/PanelHeader";
import { useOverviewDateRangeQueryState } from "../hooks/useOverviewDateRangeQueryState";
import type { WorkspacePageRendererProps } from "../types";
import { WorkspacePageView } from "./WorkspacePageView";

export const WorkspacePageQueryContent = ({ dataset, experience, section }: WorkspacePageRendererProps) => {
	const { dateRange: overviewDateRange, setDateRange } = useOverviewDateRangeQueryState(dataset);
	const dateRange = section === "overview" ? overviewDateRange : undefined;
	const {
		data: workspaceDataset = dataset,
		error,
		isFetching,
		refetch,
	} = useWorkspaceDatasetQuery(dataset, section, dateRange);
	const visibleDataset =
		section === "overview" ? reduceDatasetForDateRange(workspaceDataset, dateRange) : workspaceDataset;

	return (
		<>
			<WorkspacePageView
				bufferDataset={dataset}
				dataset={visibleDataset}
				dateRange={dateRange}
				experience={experience}
				onDateRangeChange={setDateRange}
				section={section}
			/>

			{error && <WorkspaceRefreshState error={error} isFetching={isFetching} onRetry={() => void refetch()} />}
		</>
	);
};

type WorkspaceRefreshStateProps = {
	error: Error;
	isFetching: boolean;
	onRetry: () => void;
};

const WorkspaceRefreshState = ({ error, isFetching, onRetry }: WorkspaceRefreshStateProps) => {
	const permanent = isPermanentWorkspaceDatasetError(error);

	return (
		<div aria-live="polite" className="mt-6">
			<Panel variant="accent">
				<PanelHeader
					label="Refresh"
					title={permanent ? "Workspace access needs attention" : "Workspace refresh failed"}
				/>

				<p className="text-m text-muted-foreground leading-6">{error.message}</p>

				{!permanent && (
					<Button className="mt-4" isDisabled={isFetching} onPress={onRetry} variant="secondary">
						{isFetching ? "Retrying…" : "Retry refresh"}
					</Button>
				)}
			</Panel>
		</div>
	);
};
