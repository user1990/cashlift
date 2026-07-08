"use client";

import { useState } from "react";
import type { CompanyRole, FinancialDataset, WorkspaceDatasetDateRange } from "@/modules/workspace/types";
import { buildDashboardViewModel } from "../view-model";
import { ChartsSection } from "./ChartsSection";
import { MetricsSection } from "./MetricsSection";
import { OverviewHeader } from "./OverviewHeader";
import { QueuesSection } from "./QueuesSection";

type OverviewProps = {
	dataset: FinancialDataset;
	dateRange?: WorkspaceDatasetDateRange;
	onDateRangeChange?: (dateRange: WorkspaceDatasetDateRange) => void;
};

export const Overview = ({ dataset, dateRange, onDateRangeChange }: OverviewProps) => {
	const [role] = useState<CompanyRole>(() => dataset.profile.defaultRole);
	const dashboard = buildDashboardViewModel({ dataset, date: getDashboardDate(dateRange, dataset), role });

	return (
		<div className="space-y-5">
			<OverviewHeader dashboard={dashboard} dateRange={dateRange} onDateRangeChange={onDateRangeChange} />

			<ChartsSection dashboard={dashboard} />

			<QueuesSection dashboard={dashboard} />

			<MetricsSection dashboard={dashboard} />
		</div>
	);
};

function getDashboardDate(dateRange: WorkspaceDatasetDateRange | undefined, dataset: FinancialDataset) {
	const date = dateRange?.startDate ?? dataset.forecast[0]?.date;

	return date ? new Date(`${date}T00:00:00`) : new Date();
}
