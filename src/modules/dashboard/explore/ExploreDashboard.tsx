"use client";

import type { FinancialDataset } from "@/modules/workspace/types";
import { buildDashboardViewModel } from "../view-model";
import { CashHealthDashboard } from "./CashHealthDashboard";
import { DecisionFirstDashboard } from "./DecisionFirstDashboard";
import type { ExploreDirectionId } from "./directions";
import { ExploreFrame } from "./ExploreFrame";
import { buildExplorePresentation } from "./exploreModel";
import { OperatingCockpitDashboard } from "./OperatingCockpitDashboard";

type ExploreDashboardProps = {
	dataset: FinancialDataset;
	direction: ExploreDirectionId;
};

export const ExploreDashboard = ({ dataset, direction }: ExploreDashboardProps) => {
	const dashboard = buildDashboardViewModel({
		dataset,
		role: dataset.profile.defaultRole,
	});
	const presentation = buildExplorePresentation(dashboard);
	const view = getExploreView(direction);

	return <ExploreFrame direction={direction}>{view({ basePath: "/dashboard", dashboard, presentation })}</ExploreFrame>;
};

const EXPLORE_VIEWS = {
	a: DecisionFirstDashboard,
	b: CashHealthDashboard,
	c: OperatingCockpitDashboard,
} as const;

function getExploreView(direction: ExploreDirectionId) {
	return EXPLORE_VIEWS[direction];
}
