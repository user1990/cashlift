import { parseISO } from "date-fns";
import type { VendorBill } from "@/modules/vendors/types";
import { sumAmounts } from "@/utilities/amounts/sumAmounts";
import { dueWithinWindow } from "@/utilities/dates/dueWithinWindow";
import type { FinancialDataset } from "./types";

export const getUpcomingOutflowTotal = (dataset: FinancialDataset, date = new Date(), days = 14) => {
	const dueVendorBills = dataset.vendorBills.filter((bill) => dueWithinWindow(bill.dueDate, date, days));
	const dueSubscriptions = dataset.subscriptions.filter((subscription) =>
		dueWithinWindow(subscription.renewalDate, date, days),
	);
	const pendingRequests = dataset.spendRequests.filter(
		(request) => request.status !== "rejected" && dueWithinWindow(request.neededByDate, date, days),
	);

	return (
		sumAmounts(dueVendorBills, (bill) => bill.amountCents) +
		sumAmounts(dueSubscriptions, (subscription) => subscription.amountCents) +
		sumAmounts(pendingRequests, (request) => request.amountCents)
	);
};

export const getDueVendorBills = (bills: VendorBill[], date = new Date(), days = 14) =>
	bills
		.filter((bill) => dueWithinWindow(bill.dueDate, date, days))
		.toSorted((left, right) => parseISO(left.dueDate).getTime() - parseISO(right.dueDate).getTime());
