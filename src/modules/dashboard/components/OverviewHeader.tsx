"use client";

import type { WorkspaceDatasetDateRange } from "@/modules/workspace/types";
import type { DashboardViewModel } from "../types";
import { OverviewDateRangePicker } from "./OverviewDateRangePicker";

type OverviewHeaderProps = {
	dashboard: DashboardViewModel;
	dateRange?: WorkspaceDatasetDateRange;
	onDateRangeChange?: (dateRange: WorkspaceDatasetDateRange) => void;
};

export const OverviewHeader = ({ dashboard, dateRange, onDateRangeChange }: OverviewHeaderProps) => (
	<header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
		<div className="min-w-0">
			<h1 className="font-semibold text-3xl+ text-panel-foreground tracking-normal">
				{dashboard.cashPositionHeadline}
			</h1>

			<p className="mt-1 text-m+ text-shell-muted">
				{dashboard.companyName} · {dashboard.dateRangeLabel}
			</p>
		</div>

		<OverviewDateRangePicker
			dateRange={dateRange}
			fallbackLabel={dashboard.dateRangeLabel}
			onDateRangeChange={onDateRangeChange}
		/>
	</header>
);
