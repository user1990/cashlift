"use client";

import { useSyncExternalStore } from "react";
import type { FinancialDataset, WorkspaceDatasetDateRange } from "@/modules/workspace/types";
import { subscribeToBrowserMidnight } from "@/utilities/dates/subscribeToBrowserMidnight";

export const useDashboardStatusDate = (dataset: FinancialDataset, dateRange?: WorkspaceDatasetDateRange) => {
	const isoDate = useSyncExternalStore(subscribeToBrowserMidnight, getClientStatusIsoDate, () =>
		toIsoDate(getServerDashboardStatusDate(dataset, dateRange)),
	);

	return new Date(`${isoDate}T00:00:00`);
};

const getClientStatusIsoDate = () => toIsoDate(new Date());

function getServerDashboardStatusDate(dataset: FinancialDataset, dateRange?: WorkspaceDatasetDateRange) {
	const iso = dateRange?.startDate ?? dataset.forecast[0]?.date;

	return iso ? new Date(`${iso}T00:00:00`) : new Date(0);
}

function toIsoDate(date: Date) {
	return date.toISOString().slice(0, 10);
}
