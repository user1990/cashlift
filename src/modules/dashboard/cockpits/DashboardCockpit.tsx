"use client";

import type { FinancialDataset, WorkspaceDatasetDateRange } from "@/modules/workspace/types";
import { useDashboardStatusDate } from "../hooks/useDashboardStatusDate";
import { buildDashboardViewModel } from "../view-model";
import { buildExplorePresentation } from "./exploreModel";
import { OperatingCockpitDashboard } from "./OperatingCockpitDashboard";
import { WorkspaceFindShell } from "./WorkspaceFindShell";

type DashboardCockpitProps = {
	dataset: FinancialDataset;
	basePath?: string;
	dateRange?: WorkspaceDatasetDateRange;
	onDateRangeChange?: (dateRange: WorkspaceDatasetDateRange) => void;
	readOnly?: boolean;
};

export const DashboardCockpit = ({
	basePath = "/dashboard",
	dataset,
	dateRange,
	onDateRangeChange,
}: DashboardCockpitProps) => {
	const statusDate = useDashboardStatusDate(dataset, dateRange);
	const dashboard = buildDashboardViewModel({
		dataset,
		date: statusDate,
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
