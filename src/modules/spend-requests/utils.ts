import type { MoneyCents } from "@/modules/money/types";
import type { SpendRequest } from "./types";

type SpendRequestCashDataset = {
	profile: {
		cashBalanceCents: MoneyCents;
	};
};

export const getPendingApprovalCount = (requests: SpendRequest[]) =>
	requests.filter((request) => request.status === "pending").length;

export const getSpendRequestCashImpact = (request: SpendRequest, dataset: SpendRequestCashDataset) =>
	dataset.profile.cashBalanceCents - request.amountCents;
