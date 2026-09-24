import { getPercentage } from "@/modules/money/format";

export const getTeamBudgetUsageLabel = (usagePercent: number | undefined) => {
	if (usagePercent === undefined) {
		return "Usage unavailable";
	}

	return `${getPercentage(usagePercent)} used`;
};
