"use client";

import type { FinancialDataset, WorkspaceDatasetDateRange } from "@/modules/workspace/types";
import { buildDashboardViewModel } from "../view-model";
import { buildExplorePresentation } from "./exploreModel";
import { OperatingCockpitDashboard } from "./OperatingCockpitDashboard";
import { WorkspaceFindShell } from "./WorkspaceFindShell";

type DashboardCockpitProps = {
	dataset: FinancialDataset;
	basePath?: string;
	bufferDataset?: FinancialDataset;
	dateRange?: WorkspaceDatasetDateRange;
	onDateRangeChange?: (dateRange: WorkspaceDatasetDateRange) => void;
	readOnly?: boolean;
};

export const DashboardCockpit = ({
	basePath = "/dashboard",
	bufferDataset,
	dataset,
	dateRange,
	onDateRangeChange,
}: DashboardCockpitProps) => {
	const dashboard = buildDashboardViewModel({
		bufferDataset,
		dataset,
		date: getDashboardDate(dateRange, dataset),
		role: dataset.profile.defaultRole,
	});
	const presentation = buildExplorePresentation(dashboard);

	return (
		<WorkspaceFindShell basePath={basePath} dataset={dataset}>
			<OperatingCockpitDashboard
				basePath={basePath}
				dashboard={dashboard}
				dateRange={dateRange}
				onDateRangeChange={onDateRangeChange}
				presentation={presentation}
			/>
		</WorkspaceFindShell>
	);
};

function getDashboardDate(dateRange: WorkspaceDatasetDateRange | undefined, dataset: FinancialDataset) {
	const date = dateRange?.startDate ?? dataset.forecast[0]?.date;

	return date ? new Date(`${date}T00:00:00`) : new Date();
}
