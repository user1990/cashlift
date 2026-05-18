import type { FinancialDataset } from "@/modules/workspace/types";
import type { SpendRequest } from "./types";

export const getPendingApprovalCount = (requests: SpendRequest[]) =>
	requests.filter((request) => request.status === "pending").length;

export const getSpendRequestCashImpact = (request: SpendRequest, dataset: FinancialDataset) =>
	dataset.profile.cashBalanceCents - request.amountCents;
