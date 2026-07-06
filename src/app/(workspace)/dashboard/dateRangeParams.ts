import { workspaceDatasetDateRangeSchema } from "@/modules/workspace/schemas";

export function parseInitialDateRange(startDate: string | undefined, endDate: string | undefined) {
	if (!endDate && !startDate) {
		return undefined;
	}

	const result = workspaceDatasetDateRangeSchema.safeParse({ endDate, startDate });

	return result.success ? result.data : undefined;
}
