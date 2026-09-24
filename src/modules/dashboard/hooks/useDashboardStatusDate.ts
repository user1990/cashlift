"use client";

import { useSyncExternalStore } from "react";
import type { FinancialDataset, WorkspaceDatasetDateRange } from "@/modules/workspace/types";
import { subscribeToBrowserMidnight } from "@/utilities/dates/subscribeToBrowserMidnight";
import { getDashboardAsOfDate } from "../view-model";

export const useDashboardStatusDate = (dataset: FinancialDataset, dateRange?: WorkspaceDatasetDateRange) => {
	const isoDate = useSyncExternalStore(
		subscribeToBrowserMidnight,
		() => getStatusIsoDate(dataset, dateRange, "client"),
		() => getStatusIsoDate(dataset, dateRange, "server"),
	);

	return new Date(`${isoDate}T00:00:00`);
};

function getStatusIsoDate(
	dataset: FinancialDataset,
	dateRange: WorkspaceDatasetDateRange | undefined,
	mode: "client" | "server",
) {
	if (dateRange?.startDate) {
		return dateRange.startDate;
	}

	if (mode === "client") {
		return toIsoDate(new Date());
	}

	return toIsoDate(getDashboardAsOfDate(dataset, dateRange));
}

function toIsoDate(date: Date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
}
