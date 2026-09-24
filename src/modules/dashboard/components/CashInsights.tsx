"use client";

import type { FinancialDataset } from "@/modules/workspace/types";
import { CashInsightsDashboard } from "../cockpits/CashInsightsDashboard";
import { buildCashInsightsPresentation } from "../cockpits/cashInsightsModel";
import { useDashboardStatusDate } from "../hooks/useDashboardStatusDate";
import { buildDashboardViewModel } from "../view-model";

type CashInsightsProps = {
	dataset: FinancialDataset;
	basePath?: string;
	bufferDataset?: FinancialDataset;
};

export const CashInsights = ({ basePath = "/dashboard", bufferDataset, dataset }: CashInsightsProps) => {
	const statusDate = useDashboardStatusDate(dataset);
	const dashboard = buildDashboardViewModel({
		bufferDataset,
		dataset,
		date: statusDate,
		role: dataset.profile.defaultRole,
	});

	return (
		<CashInsightsDashboard
			basePath={basePath}
			dashboard={dashboard}
			presentation={buildCashInsightsPresentation(dashboard)}
		/>
	);
};
