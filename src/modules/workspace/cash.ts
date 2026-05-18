import { getUpcomingInvoiceTotal } from "@/modules/invoices/utils";
import { getUpcomingOutflowTotal } from "./outflows";
import type { FinancialDataset } from "./types";

const DAYS_IN_MONTH = 30;

const getProjectedCashBalance = (dataset: FinancialDataset, date = new Date(), days = 14) =>
	dataset.profile.cashBalanceCents +
	getUpcomingInvoiceTotal(dataset.invoices, date, days) -
	getUpcomingOutflowTotal(dataset, date, days);

export const getCashBufferRisk = (dataset: FinancialDataset, date = new Date()) =>
	Math.max(0, dataset.profile.cashBufferTargetCents - getProjectedCashBalance(dataset, date));

export const getRunwayDays = (dataset: FinancialDataset) => {
	const recurringMonthlySpend =
		dataset.profile.monthlyPayrollCents +
		dataset.vendorBills.filter((bill) => bill.essential).reduce((total, bill) => total + bill.amountCents, 0) +
		dataset.subscriptions.reduce((total, subscription) => total + subscription.amountCents, 0);
	const dailySpend = Math.max(1, Math.round(recurringMonthlySpend / DAYS_IN_MONTH));

	return Math.floor(dataset.profile.cashBalanceCents / dailySpend);
};
