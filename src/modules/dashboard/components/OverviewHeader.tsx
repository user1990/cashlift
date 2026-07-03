"use client";

import { Download } from "lucide-react";
import type { WorkspaceDatasetDateRange } from "@/modules/workspace/types";
import { Button } from "@/ui/components/Button";
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
			<h1 className="text-3xl+ font-semibold tracking-normal text-shell-foreground">
				Good morning, {dashboard.greetingName} <span aria-hidden>👋</span>
			</h1>

			<p className="mt-1 text-m+ text-shell-muted">Here’s your cash and spend overview.</p>
		</div>

		<div className="flex flex-wrap items-center gap-3">
			<OverviewDateRangePicker
				dateRange={dateRange}
				fallbackLabel={dashboard.dateRangeLabel}
				onDateRangeChange={onDateRangeChange}
			/>

			<Button variant="primary" className="h-11 px-4">
				<Download aria-hidden className="size-4" />
				Export report
			</Button>
		</div>
	</header>
);
