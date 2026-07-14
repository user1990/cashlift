"use client";

import { useState, useSyncExternalStore } from "react";
import { Overview } from "@/modules/dashboard/components/Overview";
import { useWorkspaceDatasetQuery } from "@/modules/workspace/query";
import { reduceDatasetForDateRange } from "@/modules/workspace/read-models";
import type { FinancialDataset, WorkspaceDatasetDateRange } from "@/modules/workspace/types";
import type { WorkspaceExperience, WorkspacePageProps } from "./types";
import { WorkspaceSectionPage } from "./WorkspaceSectionPage";

type WorkspacePageContentProps = WorkspacePageProps & {
	dataset: FinancialDataset;
	experience?: WorkspaceExperience;
};

export const WorkspacePageContent = ({ dataset, experience = "production", section }: WorkspacePageContentProps) => {
	if (experience === "public-demo") {
		return <PublicDemoWorkspacePageContent dataset={dataset} experience={experience} section={section} />;
	}

	return <AuthenticatedWorkspacePageContent dataset={dataset} experience={experience} section={section} />;
};

const AuthenticatedWorkspacePageContent = ({ dataset, experience, section }: WorkspacePageContentProps) => {
	const browserHydrated = useSyncExternalStore(
		subscribeToBrowserHydration,
		getBrowserHydrationSnapshot,
		getServerHydrationSnapshot,
	);

	if (!browserHydrated) {
		return <WorkspacePageView dataset={dataset} experience={experience} section={section} />;
	}

	return <WorkspacePageQueryContent dataset={dataset} experience={experience} section={section} />;
};

const PublicDemoWorkspacePageContent = ({ dataset, experience, section }: WorkspacePageContentProps) => {
	const [overviewDateRange, setOverviewDateRange] = useState<WorkspaceDatasetDateRange | undefined>(() =>
		getForecastDateRange(dataset),
	);
	const dateRange = section === "overview" ? overviewDateRange : undefined;
	const visibleDataset = section === "overview" ? reduceDatasetForDateRange(dataset, dateRange) : dataset;

	return (
		<WorkspacePageView
			dataset={visibleDataset}
			dateRange={dateRange}
			experience={experience}
			onDateRangeChange={setOverviewDateRange}
			section={section}
		/>
	);
};

const WorkspacePageQueryContent = ({ dataset, experience, section }: WorkspacePageContentProps) => {
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
			experience={experience}
			onDateRangeChange={setOverviewDateRange}
			section={section}
		/>
	);
};

type WorkspacePageViewProps = WorkspacePageContentProps & {
	dateRange?: WorkspaceDatasetDateRange;
	onDateRangeChange?: (dateRange: WorkspaceDatasetDateRange) => void;
};

const WorkspacePageView = ({ dataset, dateRange, experience, onDateRangeChange, section }: WorkspacePageViewProps) => {
	const overview = section === "overview";
	const publicDemo = experience === "public-demo";
	const basePath = publicDemo ? "/demo/workspace" : "/dashboard";

	return overview ? (
		<Overview
			basePath={basePath}
			dataset={dataset}
			dateRange={dateRange}
			onDateRangeChange={onDateRangeChange}
			readOnly={publicDemo}
		/>
	) : (
		<WorkspaceSectionPage dataset={dataset} readOnly={publicDemo} section={section} />
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
