import type { FinancialDataset, WorkspaceDatasetScope } from "./types";

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
