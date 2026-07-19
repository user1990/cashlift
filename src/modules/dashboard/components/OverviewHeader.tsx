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
		<div>
			<h1 className="text-3xl+ font-semibold tracking-normal text-primary">
				Good morning, {dashboard.greetingName} <span aria-hidden>👋</span>
			</h1>

			<p className="mt-1 text-m+ text-shell-muted">Here’s your cash and spend overview.</p>
		</div>

		<OverviewDateRangePicker
			dateRange={dateRange}
			fallbackLabel={dashboard.dateRangeLabel}
			onDateRangeChange={onDateRangeChange}
		/>
	</header>
);
