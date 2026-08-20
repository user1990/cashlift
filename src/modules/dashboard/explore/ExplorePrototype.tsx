"use client";

import type { FinancialDataset } from "@/modules/workspace/types";
import { buildDashboardViewModel } from "../view-model";
import { buildExplorePresentation } from "./exploreModel";
import { buildFindItems, hasActiveFindFilters } from "./find/findModel";
import { useFindSession } from "./find/useFindSession";
import { WorkspaceFindCommandPalette } from "./find/WorkspaceFindCommandPalette";
import { WorkspaceFindResults } from "./find/WorkspaceFindResults";
import { WorkspaceFindTrigger } from "./find/WorkspaceFindTrigger";
import { GlassCard } from "./GlassCard";
import { OperatingCockpitDashboard } from "./OperatingCockpitDashboard";
import { PrototypeFrame } from "./PrototypeFrame";

type ExplorePrototypeProps = {
	dataset: FinancialDataset;
};

export const ExplorePrototype = ({ dataset }: ExplorePrototypeProps) => {
	const dashboard = buildDashboardViewModel({
		dataset,
		role: dataset.profile.defaultRole,
	});
	const presentation = buildExplorePresentation(dashboard);
	const items = buildFindItems(dataset, "/dashboard");
	const session = useFindSession(items, "work");
	const findActive =
		Boolean(session.query.query) || hasActiveFindFilters(session.query) || session.query.category !== "all";

	return (
		<div className="space-y-6">
			<PrototypeFrame />

			<WorkspaceFindTrigger onOpen={session.openPalette} />

			<WorkspaceFindCommandPalette items={items} session={session} />

			{findActive && !session.open ? (
				<GlassCard atmosphere="find">
					<WorkspaceFindResults itemsCount={items.length} session={session} />
				</GlassCard>
			) : (
				<OperatingCockpitDashboard basePath="/dashboard" dashboard={dashboard} presentation={presentation} />
			)}
		</div>
	);
};
