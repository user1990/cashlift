import type { MoneyCents } from "@/modules/money/types";

export type SpendRequestStatus = "pending" | "approved" | "rejected";

export type SpendRequest = {
	amountCents: MoneyCents;
	category: "software" | "travel" | "contractor" | "marketing" | "hardware";
	id: string;
	neededByDate: string;
	reason: string;
	requestedDate: string;
	requester: string;
	status: SpendRequestStatus;
	team: string;
	vendor: string;
};
