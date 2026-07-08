"use client";

import { useState, useSyncExternalStore } from "react";
import { Overview } from "@/modules/dashboard/components/Overview";
import { useWorkspaceDatasetQuery } from "@/modules/workspace/query";
import { reduceDatasetForDateRange } from "@/modules/workspace/read-models";
import type { FinancialDataset, WorkspaceDatasetDateRange } from "@/modules/workspace/types";
import type { WorkspacePageProps } from "./types";
import { WorkspaceSectionPage } from "./WorkspaceSectionPage";

type WorkspacePageContentProps = WorkspacePageProps & {
	dataset: FinancialDataset;
};

export const WorkspacePageContent = ({ dataset, section }: WorkspacePageContentProps) => {
	const browserHydrated = useSyncExternalStore(
		subscribeToBrowserHydration,
		getBrowserHydrationSnapshot,
		getServerHydrationSnapshot,
	);

	if (!browserHydrated) {
		return <WorkspacePageView dataset={dataset} section={section} />;
	}

	return <WorkspacePageQueryContent dataset={dataset} section={section} />;
};

const WorkspacePageQueryContent = ({ dataset, section }: WorkspacePageContentProps) => {
	const [overviewDateRange, setOverviewDateRange] = useState<WorkspaceDatasetDateRange | undefined>(() =>
		getForecastDateRange(dataset),
	);
	const dateRange = section === "overview" ? overviewDateRange : undefined;
	const { data: workspaceDataset } = useWorkspaceDatasetQuery(dataset, section, dateRange);
	const visibleDataset =
		section === "overview" ? reduceDatasetForDateRange(workspaceDataset, dateRange) : workspaceDataset;

	return (
		<WorkspacePageView
			dataset={visibleDataset}
			dateRange={dateRange}
			onDateRangeChange={setOverviewDateRange}
			section={section}
		/>
	);
};

type WorkspacePageViewProps = WorkspacePageContentProps & {
	dateRange?: WorkspaceDatasetDateRange;
	onDateRangeChange?: (dateRange: WorkspaceDatasetDateRange) => void;
};

const WorkspacePageView = ({ dataset, dateRange, onDateRangeChange, section }: WorkspacePageViewProps) => {
	const overview = section === "overview";

	return overview ? (
		<Overview dataset={dataset} dateRange={dateRange} onDateRangeChange={onDateRangeChange} />
	) : (
		<WorkspaceSectionPage dataset={dataset} section={section} />
	);
};

let browserHydrated = false;

function subscribeToBrowserHydration(onStoreChange: () => void) {
	if (!browserHydrated) {
		browserHydrated = true;
		onStoreChange();
	}

	return () => undefined;
}

function getBrowserHydrationSnapshot() {
	return browserHydrated;
}

function getServerHydrationSnapshot() {
	return false;
}

function getForecastDateRange(dataset: FinancialDataset): WorkspaceDatasetDateRange | undefined {
	const startDate = dataset.forecast[0]?.date;
	const endDate = dataset.forecast.at(-1)?.date;

	return startDate && endDate ? { endDate, startDate } : undefined;
}
