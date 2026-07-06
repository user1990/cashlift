"use client";

import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { Overview } from "@/modules/dashboard/components/Overview";
import { useWorkspaceDatasetQuery } from "@/modules/workspace/query";
import { reduceDatasetForDateRange } from "@/modules/workspace/read-models";
import type { FinancialDataset, WorkspaceDatasetDateRange } from "@/modules/workspace/types";
import { getOverviewDateRangeHref } from "./overviewDateRangeUrl";
import type { WorkspacePageProps } from "./types";
import { WorkspaceSectionPage } from "./WorkspaceSectionPage";

type WorkspacePageContentProps = WorkspacePageProps & {
	dataset: FinancialDataset;
	initialDateRange?: WorkspaceDatasetDateRange;
};

export const WorkspacePageContent = ({ dataset, initialDateRange, section }: WorkspacePageContentProps) => {
	const browserHydrated = useSyncExternalStore(
		subscribeToBrowserHydration,
		getBrowserHydrationSnapshot,
		getServerHydrationSnapshot,
	);

	if (!browserHydrated) {
		const dateRange = section === "overview" ? getInitialDateRange(dataset, initialDateRange) : undefined;
		const visibleDataset = section === "overview" ? reduceDatasetForDateRange(dataset, dateRange) : dataset;

		return <WorkspacePageView dataset={visibleDataset} dateRange={dateRange} section={section} />;
	}

	return <WorkspacePageQueryContent dataset={dataset} initialDateRange={initialDateRange} section={section} />;
};

const WorkspacePageQueryContent = ({ dataset, initialDateRange, section }: WorkspacePageContentProps) => {
	const router = useRouter();
	const defaultDateRange = getForecastDateRange(dataset);
	const [overviewDateRange, setOverviewDateRange] = useState<WorkspaceDatasetDateRange | undefined>(() =>
		getInitialDateRange(dataset, initialDateRange),
	);
	const dateRange = section === "overview" ? overviewDateRange : undefined;
	const { data: workspaceDataset } = useWorkspaceDatasetQuery(dataset, section, dateRange);
	const visibleDataset =
		section === "overview" ? reduceDatasetForDateRange(workspaceDataset, dateRange) : workspaceDataset;
	const updateOverviewDateRange = (nextDateRange: WorkspaceDatasetDateRange) => {
		setOverviewDateRange(nextDateRange);
		replaceOverviewDateRangeUrl(router.replace, nextDateRange, defaultDateRange);
	};

	return (
		<WorkspacePageView
			dataset={visibleDataset}
			dateRange={dateRange}
			onDateRangeChange={updateOverviewDateRange}
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

function getInitialDateRange(dataset: FinancialDataset, initialDateRange: WorkspaceDatasetDateRange | undefined) {
	return initialDateRange ?? getForecastDateRange(dataset);
}

function replaceOverviewDateRangeUrl(
	replace: (href: string, options?: { scroll?: boolean }) => void,
	dateRange: WorkspaceDatasetDateRange,
	defaultDateRange: WorkspaceDatasetDateRange | undefined,
) {
	replace(getOverviewDateRangeHref({ currentHref: window.location.href, dateRange, defaultDateRange }), {
		scroll: false,
	});
}
