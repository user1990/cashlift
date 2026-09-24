import type { FinancialDataset } from "./types";

export const EMPTY_DATASET_PARTS = {
	cashActions: [],
	forecast: [],
	invoices: [],
	spendRequests: [],
	subscriptions: [],
	teamBudgets: [],
	teamMembers: [],
	vendorBills: [],
} as const satisfies Omit<FinancialDataset, "profile">;

export type DatasetTable = keyof Omit<FinancialDataset, "profile">;
