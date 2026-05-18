import { sumAmounts } from "@/utilities/amounts/sumAmounts";
import type { Subscription } from "./types";

export const isVendorLeak = (subscription: Subscription) =>
	subscription.status === "unused" ||
	subscription.status === "duplicate" ||
	(subscription.status === "trial" && subscription.usagePercent < 25);

export const getVendorLeakSavings = (subscriptions: Subscription[]) =>
	sumAmounts(subscriptions.filter(isVendorLeak), (subscription) => subscription.amountCents);
