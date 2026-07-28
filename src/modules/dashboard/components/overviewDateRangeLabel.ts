import type { WorkspaceDatasetDateRange } from "@/modules/workspace/types";

const DATE_RANGE_FORMATTER = new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short", year: "numeric" });

export function getOverviewDateRangeLabel(dateRange: WorkspaceDatasetDateRange | undefined, fallbackLabel: string) {
	if (!dateRange) {
		return fallbackLabel;
	}

	const startDate = new Date(`${dateRange.startDate}T00:00:00`);
	const endDate = new Date(`${dateRange.endDate}T00:00:00`);

	return DATE_RANGE_FORMATTER.formatRange(startDate, endDate);
}
