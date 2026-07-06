"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import type { FinancialDataset, WorkspaceDatasetDateRange } from "@/modules/workspace/types";
import { Button } from "@/ui/components/Button";
import { buildOverviewCsvReport } from "../csv-report";
import type { DashboardViewModel } from "../types";
import { OverviewDateRangePicker } from "./OverviewDateRangePicker";

type OverviewHeaderProps = {
	dashboard: DashboardViewModel;
	dataset: FinancialDataset;
	dateRange?: WorkspaceDatasetDateRange;
	onDateRangeChange?: (dateRange: WorkspaceDatasetDateRange) => void;
};

export const OverviewHeader = ({ dashboard, dataset, dateRange, onDateRangeChange }: OverviewHeaderProps) => {
	const [exportState, setExportState] = useState<"idle" | "preparing">("idle");
	const [exportError, setExportError] = useState<string>();
	const exportPreparing = exportState === "preparing";
	const exportErrorId = exportError ? "overview-export-error" : undefined;

	const exportCsv = () => {
		setExportState("preparing");
		setExportError(undefined);

		window.setTimeout(() => {
			try {
				const report = buildOverviewCsvReport({ dashboard, dataset, dateRange });
				downloadCsvReport(report);
				setExportState("idle");
			} catch {
				setExportError("We couldn’t prepare the CSV. Try again.");
				setExportState("idle");
			}
		}, 0);
	};

	return (
		<header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
			<div>
				<h1 className="text-3xl+ font-semibold tracking-normal text-shell-foreground">
					Good morning, {dashboard.greetingName} <span aria-hidden>👋</span>
				</h1>

				<p className="mt-1 text-m+ text-shell-muted">Here’s your cash and spend overview.</p>
			</div>

			<div className="flex flex-col items-start gap-2 sm:items-end">
				<div className="flex flex-wrap items-center gap-3">
					<OverviewDateRangePicker
						dateRange={dateRange}
						fallbackLabel={dashboard.dateRangeLabel}
						onDateRangeChange={onDateRangeChange}
					/>

					<Button
						aria-describedby={exportErrorId}
						isDisabled={exportPreparing}
						onPress={exportCsv}
						variant="primary"
						className="h-11 px-4"
					>
						<Download aria-hidden className="size-4" />
						{exportPreparing ? "Preparing CSV…" : "Export CSV"}
					</Button>
				</div>

				{exportError ? (
					<p id={exportErrorId} role="alert" className="max-w-80 text-right text-s+ text-red-300">
						{exportError}
					</p>
				) : null}
			</div>
		</header>
	);
};

function downloadCsvReport({ content, filename }: { content: string; filename: string }) {
	const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");

	link.href = url;
	link.download = filename;
	link.click();
	URL.revokeObjectURL(url);
}
