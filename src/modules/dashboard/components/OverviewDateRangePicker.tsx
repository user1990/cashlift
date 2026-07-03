"use client";

import dynamic from "next/dynamic";
import type { WorkspaceDatasetDateRange } from "@/modules/workspace/types";

export type OverviewDateRangePickerProps = {
	dateRange?: WorkspaceDatasetDateRange;
	fallbackLabel: string;
	onDateRangeChange?: (dateRange: WorkspaceDatasetDateRange) => void;
};

const DynamicOverviewDateRangePicker = dynamic(
	() => import("./OverviewDateRangePickerClient").then((mod) => mod.OverviewDateRangePickerClient),
	{ ssr: false },
);

export const OverviewDateRangePicker = (props: OverviewDateRangePickerProps) => (
	<DynamicOverviewDateRangePicker {...props} />
);
