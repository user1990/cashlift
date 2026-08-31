"use client";

import type { FinancialDataset, WorkspaceDatasetDateRange } from "@/modules/workspace/types";
import { buildDashboardViewModel } from "../view-model";
import { buildExplorePresentation } from "./exploreModel";
import { buildFindItems, hasActiveFindFilters } from "./find/findModel";
import { useFindSession } from "./find/useFindSession";
import { WorkspaceFindCommandPalette } from "./find/WorkspaceFindCommandPalette";
import { WorkspaceFindResults } from "./find/WorkspaceFindResults";
import { WorkspaceFindTrigger } from "./find/WorkspaceFindTrigger";
import { GlassCard } from "./GlassCard";
import { OperatingCockpitDashboard } from "./OperatingCockpitDashboard";

type DashboardCockpitProps = {
	dataset: FinancialDataset;
	basePath?: string;
	bufferDataset?: FinancialDataset;
	dateRange?: WorkspaceDatasetDateRange;
	onDateRangeChange?: (dateRange: WorkspaceDatasetDateRange) => void;
	readOnly?: boolean;
};

export const DashboardCockpit = ({
	basePath = "/dashboard",
	bufferDataset,
	dataset,
	dateRange,
	onDateRangeChange,
}: DashboardCockpitProps) => {
	const dashboard = buildDashboardViewModel({
		bufferDataset,
		dataset,
		date: getDashboardDate(dateRange, dataset),
		role: dataset.profile.defaultRole,
	});
	const presentation = buildExplorePresentation(dashboard);
	const items = buildFindItems(dataset, basePath);
	const session = useFindSession(items, "work");
	const findActive =
		Boolean(session.query.query) || hasActiveFindFilters(session.query) || session.query.category !== "all";

	return (
		<div className="space-y-6">
			<WorkspaceFindTrigger onOpen={session.openPalette} />

			<WorkspaceFindCommandPalette items={items} session={session} />

			{findActive && !session.open ? (
				<GlassCard atmosphere="find">
					<WorkspaceFindResults itemsCount={items.length} session={session} />
				</GlassCard>
			) : (
				<OperatingCockpitDashboard
					basePath={basePath}
					dashboard={dashboard}
					dateRange={dateRange}
					onDateRangeChange={onDateRangeChange}
					presentation={presentation}
				/>
			)}
		</div>
	);
};

function getDashboardDate(dateRange: WorkspaceDatasetDateRange | undefined, dataset: FinancialDataset) {
	const date = dateRange?.startDate ?? dataset.forecast[0]?.date;

	return date ? new Date(`${date}T00:00:00`) : new Date();
}
