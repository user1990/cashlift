import type { MoneyCents } from "@/modules/money/types";
import type { SpendRequest } from "@/modules/spend-requests/types";
import type { DashboardViewModel } from "../types";
import { formatExploreMoney } from "./exploreModel";

export type ApprovalsPresentation = ReturnType<typeof buildApprovalsPresentation>;

export const buildApprovalsPresentation = (dashboard: DashboardViewModel) => {
	const pendingRequests = dashboard.pendingApprovals;
	const pendingAmountCents = pendingRequests.reduce((totalCents, request) => totalCents + request.amountCents, 0);
	const primaryRequest = pendingRequests[0];

	return {
		contextLine: `${dashboard.companyName} · Spend approvals`,
		headline: getApprovalsHeadline(pendingRequests.length, pendingAmountCents),
		pendingAmountCents,
		primaryRequest,
		remainingRequests: pendingRequests.slice(1),
	};
};

export const formatSpendCategory = (category: SpendRequest["category"]) =>
	`${category.slice(0, 1).toUpperCase()}${category.slice(1)}`;

function getApprovalsHeadline(pendingCount: number, pendingAmountCents: MoneyCents) {
	if (pendingCount === 0) {
		return "You are clear on spend requests";
	}

	if (pendingCount === 1) {
		return `1 spend request totaling ${formatExploreMoney(pendingAmountCents)} needs a decision`;
	}

	return `${pendingCount} spend requests totaling ${formatExploreMoney(pendingAmountCents)} need a decision`;
}
