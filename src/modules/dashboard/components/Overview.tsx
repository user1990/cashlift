"use client";

import { useState } from "react";
import type { CompanyRole, FinancialDataset, WorkspaceDatasetDateRange } from "@/modules/workspace/types";
import { buildDashboardViewModel } from "../view-model";
import { ActionInbox } from "./ActionInbox";
import { ChartsSection } from "./ChartsSection";
import { MetricsSection } from "./MetricsSection";
import { OverviewHeader } from "./OverviewHeader";
import { QueuesSection } from "./QueuesSection";

type OverviewProps = {
	dataset: FinancialDataset;
	basePath?: string;
	dateRange?: WorkspaceDatasetDateRange;
	onDateRangeChange?: (dateRange: WorkspaceDatasetDateRange) => void;
	readOnly?: boolean;
};

export const Overview = ({
	basePath = "/dashboard",
	dataset,
	dateRange,
	onDateRangeChange,
	readOnly,
}: OverviewProps) => {
	const [role] = useState<CompanyRole>(() => dataset.profile.defaultRole);
	const dashboard = buildDashboardViewModel({ dataset, date: getDashboardDate(dateRange, dataset), role });

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
