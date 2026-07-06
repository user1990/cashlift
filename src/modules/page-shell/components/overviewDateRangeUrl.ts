import type { WorkspaceDatasetDateRange } from "@/modules/workspace/types";

export function getOverviewDateRangeHref({
	currentHref,
	dateRange,
	defaultDateRange,
}: {
	currentHref: string;
	dateRange: WorkspaceDatasetDateRange;
	defaultDateRange?: WorkspaceDatasetDateRange;
}) {
	const currentUrl = new URL(currentHref);

	if (defaultDateRange && rangesMatch(dateRange, defaultDateRange)) {
		currentUrl.searchParams.delete("endDate");
		currentUrl.searchParams.delete("startDate");
	} else {
		currentUrl.searchParams.set("endDate", dateRange.endDate);
		currentUrl.searchParams.set("startDate", dateRange.startDate);
	}

	return `${currentUrl.pathname}${currentUrl.search}`;
}

function rangesMatch(left: WorkspaceDatasetDateRange, right: WorkspaceDatasetDateRange) {
	return left.endDate === right.endDate && left.startDate === right.startDate;
}
