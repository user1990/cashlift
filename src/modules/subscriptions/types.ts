import type { MoneyCents } from "@/modules/money/types";

export type SubscriptionStatus = "active" | "unused" | "duplicate" | "trial";

export type Subscription = {
	amountCents: MoneyCents;
	id: string;
	owner: string;
	renewalDate: string;
	status: SubscriptionStatus;
	usagePercent: number;
	vendor: string;
};
