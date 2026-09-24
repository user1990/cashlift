import { getUpcomingInvoiceTotal } from "@/modules/invoices/utils";
import { sumAmounts } from "@/utilities/amounts/sumAmounts";
import { getUpcomingOutflowTotal } from "./outflows";
import type { FinancialDataset } from "./types";

const DAYS_IN_MONTH = 30;

const getProjectedCashBalance = (dataset: FinancialDataset, date: Date, days = 14) =>
	dataset.profile.cashBalanceCents +
	getUpcomingInvoiceTotal(dataset.invoices, date, days) -
	getUpcomingOutflowTotal(dataset, date, days);

export const getCashBufferRisk = (dataset: FinancialDataset, date: Date) =>
	Math.max(0, dataset.profile.cashBufferTargetCents - getProjectedCashBalance(dataset, date));

export const getRunwayDays = (dataset: FinancialDataset) => {
	const essentialBillTotal = sumAmounts(
		dataset.vendorBills.filter((bill) => bill.essential),
		(bill) => bill.amountCents,
	);
	const subscriptionTotal = sumAmounts(dataset.subscriptions, (subscription) => subscription.amountCents);
	const recurringMonthlySpend = dataset.profile.monthlyPayrollCents + essentialBillTotal + subscriptionTotal;

	if (recurringMonthlySpend <= 0) {
		return undefined;
	}

	const dailySpend = Math.round(recurringMonthlySpend / DAYS_IN_MONTH);

	return Math.floor(dataset.profile.cashBalanceCents / dailySpend);
};
