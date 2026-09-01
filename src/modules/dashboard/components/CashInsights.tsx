"use client";

import type { FinancialDataset } from "@/modules/workspace/types";
import { CashInsightsDashboard } from "../explore/CashInsightsDashboard";
import { buildCashInsightsPresentation } from "../explore/cashInsightsModel";
import { buildDashboardViewModel } from "../view-model";

type CashInsightsProps = {
	dataset: FinancialDataset;
	basePath?: string;
	bufferDataset?: FinancialDataset;
};

export const CashInsights = ({ basePath = "/dashboard", bufferDataset, dataset }: CashInsightsProps) => {
	const dashboard = buildDashboardViewModel({
		bufferDataset,
		dataset,
		date: getCashInsightsDate(dataset),
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

function getCashInsightsDate(dataset: FinancialDataset) {
	const date = dataset.forecast[0]?.date;

	return date ? new Date(`${date}T00:00:00`) : new Date();
}
