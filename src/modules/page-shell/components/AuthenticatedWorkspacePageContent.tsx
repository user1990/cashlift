"use client";

import { useSyncExternalStore } from "react";
import { WorkspacePageQueryContent } from "./WorkspacePageQueryContent";
import { WorkspacePageView } from "./WorkspacePageView";
import type { WorkspacePageRendererProps } from "./workspacePageContentTypes";

export const AuthenticatedWorkspacePageContent = ({ dataset, experience, section }: WorkspacePageRendererProps) => {
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
