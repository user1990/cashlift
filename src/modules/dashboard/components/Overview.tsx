"use client";

import { useState, useSyncExternalStore } from "react";
import type { CompanyRole, FinancialDataset } from "@/modules/workspace/types";
import { buildDashboardViewModel } from "../view-model";
import { ChartsSection } from "./ChartsSection";
import { MetricsSection } from "./MetricsSection";
import { OverviewHeader } from "./OverviewHeader";
import { QueuesSection } from "./QueuesSection";

type OverviewProps = {
	dataset: FinancialDataset;
};

export const Overview = ({ dataset }: OverviewProps) => {
	const chartsReady = useMounted();
	const [role] = useState<CompanyRole>(() => dataset.profile.defaultRole);
	const dashboard = buildDashboardViewModel({ dataset, role });

	return (
		<div className="space-y-5">
			<OverviewHeader dashboard={dashboard} />

			<ChartsSection chartsReady={chartsReady} dashboard={dashboard} />

			<QueuesSection dashboard={dashboard} />

			<MetricsSection dashboard={dashboard} />
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
