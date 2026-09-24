const formatCashOutlookWeekCount = (weekCount: number) => (weekCount > 0 ? `${weekCount}-week` : "");

export const getCashOutlookSectionTitle = (weekCount: number) => {
	const prefix = formatCashOutlookWeekCount(weekCount);

	return prefix ? `${prefix} Cash Outlook` : "Cash Outlook";
};

export const getCashOutlookCaption = (weekCount: number) => {
	const prefix = formatCashOutlookWeekCount(weekCount);

	return prefix ? `${prefix} cash outlook by week` : "Cash outlook by week";
};

export const getCashOutlookEmptyMessage = (weekCount: number) => {
	const prefix = formatCashOutlookWeekCount(weekCount);

	return prefix ? `No ${prefix} outlook for this range.` : "No cash outlook for this range.";
};
