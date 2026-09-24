"use client";

import type { FinancialDataset, WorkspaceDatasetDateRange } from "@/modules/workspace/types";
import { DashboardCockpit } from "../cockpits/DashboardCockpit";

type OverviewProps = {
	dataset: FinancialDataset;
	basePath?: string;
	dateRange?: WorkspaceDatasetDateRange;
	onDateRangeChange?: (dateRange: WorkspaceDatasetDateRange) => void;
	readOnly?: boolean;
};

export const Overview = (props: OverviewProps) => <DashboardCockpit {...props} />;
