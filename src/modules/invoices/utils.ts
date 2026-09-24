import { sumAmounts } from "@/utilities/amounts/sumAmounts";
import { dueWithinWindow } from "@/utilities/dates/dueWithinWindow";
import type { Invoice } from "./types";

const isInvoiceOutstanding = (invoice: Invoice) => invoice.status !== "paid";

export const isInvoiceOverdue = (invoice: Invoice, date: Date) => {
	if (!isInvoiceOutstanding(invoice)) {
		return false;
	}

	return invoice.status === "overdue" || dueWithinWindow(invoice.dueDate, date, -1);
};

export const getInvoiceRiskTotal = (invoices: Invoice[], date: Date) =>
	sumAmounts(
		invoices.filter((invoice) => isInvoiceOverdue(invoice, date)),
		(invoice) => invoice.amountCents,
	);

export const getUpcomingInvoiceTotal = (invoices: Invoice[], date: Date, days = 14) =>
	sumAmounts(
		invoices.filter((invoice) => isInvoiceOutstanding(invoice) && dueWithinWindow(invoice.dueDate, date, days)),
		(invoice) => invoice.amountCents,
	);
