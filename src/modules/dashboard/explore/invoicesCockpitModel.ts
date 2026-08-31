import type { CashAction } from "@/modules/cash-actions/types";
import type { Invoice, InvoiceStatus } from "@/modules/invoices/types";
import { isInvoiceOverdue } from "@/modules/invoices/utils";
import { formatCurrency } from "@/modules/money/format";
import type { FinancialDataset } from "@/modules/workspace/types";
import { sumAmounts } from "@/utilities/amounts/sumAmounts";
import { formatDashboardDate } from "../overviewDateRangeLabel";

export const INVOICE_STATUS_LABEL = {
	overdue: "Overdue",
	paid: "Paid",
	promised: "Promised",
	sent: "Sent",
} as const satisfies Record<InvoiceStatus, string>;

export type InvoicesCockpitPresentation = ReturnType<typeof buildInvoicesCockpitPresentation>;

type BuildInvoicesCockpitPresentationParams = {
	dataset: FinancialDataset;
	asOfDate?: Date;
	invoiceRiskTotal?: number;
};

/** Throwaway prototype: maps invoice records onto the overview cockpit slots. */
export const buildInvoicesCockpitPresentation = ({
	asOfDate,
	dataset,
	invoiceRiskTotal,
}: BuildInvoicesCockpitPresentationParams) => {
	const overdue = dataset.invoices
		.filter((invoice) => isOverdueForView(invoice, asOfDate))
		.toSorted((left, right) => right.amountCents - left.amountCents)
		.map((invoice) => withViewStatus(invoice, asOfDate));
	const paid = dataset.invoices
		.filter((invoice) => invoice.status === "paid")
		.map((invoice) => withViewStatus(invoice, asOfDate));
	const openOnTime = dataset.invoices
		.filter((invoice) => invoice.status !== "paid" && !isOverdueForView(invoice, asOfDate))
		.toSorted((left, right) => left.dueDate.localeCompare(right.dueDate))
		.map((invoice) => withViewStatus(invoice, asOfDate));
	const dueSchedule = dataset.invoices
		.filter((invoice) => invoice.status !== "paid")
		.toSorted((left, right) => left.dueDate.localeCompare(right.dueDate))
		.map((invoice) => withViewStatus(invoice, asOfDate));
	const primaryInvoice = overdue[0];
	const collectionActions = dataset.cashActions.filter(
		(action) => action.status === "open" && action.type === "collection",
	);
	const primaryAction = primaryInvoice
		? collectionActions.find((action) => invoiceMatchesCollectionAction(primaryInvoice, action))
		: undefined;

	return {
		companyName: dataset.profile.name,
		dueSchedule,
		headline:
			invoiceRiskTotal === undefined
				? "Calculating overdue cash risk"
				: `${formatCurrency(invoiceRiskTotal)} overdue cash risk`,
		invoiceCount: dataset.invoices.length,
		openOnTime,
		openOnTimeCents: sumAmounts(openOnTime, (invoice) => invoice.amountCents),
		overdue,
		overdueCents: invoiceRiskTotal,
		paid,
		paidCents: sumAmounts(paid, (invoice) => invoice.amountCents),
		primaryAction,
		primaryInvoice,
		queueInvoices: overdue.slice(1),
		supportNotes: [
			"Recording a collected payment is not wired on this page yet.",
			"Invoice aging beyond due date and status is not modeled yet.",
		],
	};
};

export const getInvoiceAnchorId = (invoiceId: string) => `invoice-${invoiceId}`;

export const formatInvoiceDueDate = (isoDate: string) => formatDashboardDate(isoDate);

export type InvoiceCockpitRow = Invoice & { viewStatus: InvoiceStatus };

function withViewStatus(invoice: Invoice, asOfDate: Date | undefined): InvoiceCockpitRow {
	return {
		...invoice,
		viewStatus: invoice.status === "paid" || !isOverdueForView(invoice, asOfDate) ? invoice.status : "overdue",
	};
}

function isOverdueForView(invoice: Invoice, asOfDate: Date | undefined) {
	if (!asOfDate) {
		return invoice.status === "overdue";
	}

	return isInvoiceOverdue(invoice, asOfDate);
}

function invoiceMatchesCollectionAction(invoice: Invoice, action: CashAction) {
	return (
		action.impactCents === invoice.amountCents || action.title.toLowerCase().includes(invoice.client.toLowerCase())
	);
}
