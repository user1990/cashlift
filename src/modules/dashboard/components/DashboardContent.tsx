"use client";

import { useState, useSyncExternalStore } from "react";
import type { CompanyRole, FinancialDataset } from "@/modules/workspace/types";
import { buildDashboardViewModel } from "../view-model";
import { DashboardChartsSection } from "./DashboardChartsSection";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardMetricsSection } from "./DashboardMetricsSection";
import { DashboardQueuesSection } from "./DashboardQueuesSection";

type DashboardContentProps = {
	dataset: FinancialDataset;
};

export const DashboardContent = ({ dataset }: DashboardContentProps) => {
	const chartsReady = useMounted();
	const [role] = useState<CompanyRole>(() => dataset.profile.defaultRole);
	const dashboard = buildDashboardViewModel({ dataset, role });

	return (
		<div className="space-y-5">
			<DashboardHeader dashboard={dashboard} />

			<DashboardChartsSection chartsReady={chartsReady} dashboard={dashboard} />

			<DashboardQueuesSection dashboard={dashboard} />

			<DashboardMetricsSection dashboard={dashboard} />
		</div>
	);
};

function useMounted() {
	return useSyncExternalStore(
		() => () => undefined,
		() => true,
		() => false,
	);
}
