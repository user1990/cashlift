"use client";

import {
	isPermanentWorkspaceDatasetError,
	useWorkspaceDatasetQuery,
	workspaceDatasetMatchesInitialRange,
} from "@/modules/workspace/query";
import { Button } from "@/ui/components/actions/Button";
import { Panel } from "@/ui/components/layout/Panel";
import { PanelHeader } from "@/ui/components/layout/PanelHeader";
import { useOverviewDateRangeQueryState } from "../hooks/useOverviewDateRangeQueryState";
import type { WorkspacePageRendererProps } from "../types";
import { WorkspacePageLoading } from "./WorkspacePageLoading";
import { WorkspacePageView } from "./WorkspacePageView";

export const WorkspacePageQueryContent = ({ dataset, experience, section }: WorkspacePageRendererProps) => {
	const { dateRange: overviewDateRange, setDateRange } = useOverviewDateRangeQueryState(dataset);
	const dateRange = section === "overview" ? overviewDateRange : undefined;
	const rangeMatchesInitial = workspaceDatasetMatchesInitialRange(dataset, section, dateRange);
	const { data, error, isFetching, refetch } = useWorkspaceDatasetQuery(dataset, section, dateRange);
	const workspaceDataset = data ?? (rangeMatchesInitial ? dataset : undefined);

	if (!workspaceDataset) {
		if (error) {
			return <WorkspaceRefreshState error={error} isFetching={isFetching} onRetry={() => void refetch()} />;
		}

		return <WorkspacePageLoading section={section} />;
	}

	return (
		<>
			<WorkspacePageView
				dataset={workspaceDataset}
				dateRange={dateRange}
				experience={experience}
				onDateRangeChange={setDateRange}
				section={section}
			/>

			{error != null && <WorkspaceRefreshState error={error} isFetching={isFetching} onRetry={() => void refetch()} />}
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
		<div aria-live="assertive" className="mt-6" role="alert">
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
