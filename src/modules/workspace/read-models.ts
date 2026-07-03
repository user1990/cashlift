import type { FinancialDataset, WorkspaceDatasetDateRange, WorkspaceDatasetScope } from "./types";

const EMPTY_DATASET_PARTS = {
	cashActions: [],
	forecast: [],
	invoices: [],
	spendRequests: [],
	subscriptions: [],
	teamBudgets: [],
	teamMembers: [],
	vendorBills: [],
} as const satisfies Omit<FinancialDataset, "profile">;

export const reduceDatasetForScope = (dataset: FinancialDataset, scope: WorkspaceDatasetScope): FinancialDataset => {
	if (scope === "overview") {
		return dataset;
	}

	return {
		...EMPTY_DATASET_PARTS,
		profile: dataset.profile,
		...getScopedDatasetParts(dataset, scope),
	};
};

const getScopedDatasetParts = (
	dataset: FinancialDataset,
	scope: Exclude<WorkspaceDatasetScope, "overview">,
): Partial<Omit<FinancialDataset, "profile">> => {
	const scopedParts = {
		approvals: { spendRequests: dataset.spendRequests },
		budgets: { teamBudgets: dataset.teamBudgets },
		cash: {},
		invoices: { invoices: dataset.invoices },
		settings: {},
		team: { teamMembers: dataset.teamMembers },
		vendors: { subscriptions: dataset.subscriptions },
	} as const satisfies Record<Exclude<WorkspaceDatasetScope, "overview">, Partial<Omit<FinancialDataset, "profile">>>;

	return scopedParts[scope];
};

export const reduceDatasetForDateRange = (
	dataset: FinancialDataset,
	dateRange?: WorkspaceDatasetDateRange,
): FinancialDataset => {
	if (!dateRange) {
		return dataset;
	}

	return {
		...dataset,
		cashActions: dataset.cashActions.filter((action) => isDateInRange(action.dueDate, dateRange)),
		forecast: dataset.forecast.filter((point) => isDateInRange(point.date, dateRange)),
		invoices: dataset.invoices.filter((invoice) => isDateInRange(invoice.dueDate, dateRange)),
		spendRequests: dataset.spendRequests.filter((request) => isDateInRange(request.neededByDate, dateRange)),
		subscriptions: dataset.subscriptions.filter((subscription) => isDateInRange(subscription.renewalDate, dateRange)),
		vendorBills: dataset.vendorBills.filter((bill) => isDateInRange(bill.dueDate, dateRange)),
	};
};

function isDateInRange(date: string, { endDate, startDate }: WorkspaceDatasetDateRange) {
	return date >= startDate && date <= endDate;
}
