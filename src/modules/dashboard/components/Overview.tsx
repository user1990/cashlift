"use client";

import type { FinancialDataset, WorkspaceDatasetDateRange } from "@/modules/workspace/types";
import { buildDashboardViewModel } from "../view-model";
import { ActionInbox } from "./ActionInbox";
import { ChartsSection } from "./ChartsSection";
import { MetricsSection } from "./MetricsSection";
import { OverviewHeader } from "./OverviewHeader";
import { QueuesSection } from "./QueuesSection";

type OverviewProps = {
	dataset: FinancialDataset;
	basePath?: string;
	bufferDataset?: FinancialDataset;
	dateRange?: WorkspaceDatasetDateRange;
	onDateRangeChange?: (dateRange: WorkspaceDatasetDateRange) => void;
	readOnly?: boolean;
};

export const Overview = ({
	basePath = "/dashboard",
	bufferDataset,
	dataset,
	dateRange,
	onDateRangeChange,
	readOnly = false,
}: OverviewProps) => {
	const dashboard = buildDashboardViewModel({
		bufferDataset,
		dataset,
		date: getDashboardDate(dateRange, dataset),
		role: dataset.profile.defaultRole,
	});

	return (
		<div className="space-y-5">
			<OverviewHeader dashboard={dashboard} dateRange={dateRange} onDateRangeChange={onDateRangeChange} />

			<ActionInbox actions={dashboard.actionInbox} basePath={basePath} />

			<ChartsSection dashboard={dashboard} />

			<QueuesSection basePath={basePath} dashboard={dashboard} readOnly={readOnly} />

			<MetricsSection dashboard={dashboard} />
		</div>
	);
};

function getDashboardDate(dateRange: WorkspaceDatasetDateRange | undefined, dataset: FinancialDataset) {
	const date = dateRange?.startDate ?? dataset.forecast[0]?.date;

	return date ? new Date(`${date}T00:00:00`) : new Date();
}
