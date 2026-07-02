"use client";

import { useSyncExternalStore } from "react";
import { Overview } from "@/modules/dashboard/components/Overview";
import { useWorkspaceDatasetQuery } from "@/modules/workspace/query";
import type { FinancialDataset } from "@/modules/workspace/types";
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
	const { data: workspaceDataset } = useWorkspaceDatasetQuery(dataset, section);

	return <WorkspacePageView dataset={workspaceDataset} section={section} />;
};

const WorkspacePageView = ({ dataset, section }: WorkspacePageContentProps) => {
	const overview = section === "overview";

	return overview ? <Overview dataset={dataset} /> : <WorkspaceSectionPage dataset={dataset} section={section} />;
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
