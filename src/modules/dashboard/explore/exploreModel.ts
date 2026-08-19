import { formatCurrency, formatCurrencyDollars, formatPreciseCompactCurrency } from "@/modules/money/format";
import type { MoneyCents } from "@/modules/money/types";
import { formatDashboardDate } from "../overviewDateRangeLabel";
import type { DashboardViewModel } from "../types";

type CashAction = DashboardViewModel["actionInbox"][number];

export const CASH_ACTION_NEXT_STEP = {
	approval: "Open approvals",
	"cash-buffer": "Open cash insights",
	collection: "Open invoices",
	forecast: "Open cash insights",
	"vendor-leak": "Open vendors",
} as const satisfies Record<CashAction["type"], string>;

export const CASH_ACTION_WORK = {
	approval: "Decide this spend request",
	"cash-buffer": "Protect the cash buffer",
	collection: "Collect this invoice",
	forecast: "Review the cash outlook",
	"vendor-leak": "Cut this vendor leak",
} as const satisfies Record<CashAction["type"], string>;

export type ExplorePresentation = ReturnType<typeof buildExplorePresentation>;

export const buildExplorePresentation = (dashboard: DashboardViewModel) => {
	const overdueInvoiceCents = dashboard.overdueInvoices.reduce(
		(totalCents, invoice) => totalCents + invoice.amountCents,
		0,
	);
	const vendorLeakCents = dashboard.vendorLeaks.reduce((totalCents, leak) => totalCents + leak.amountCents, 0);

	return {
		cashContextLine: getCashContextLine(dashboard),
		inactionLines: getInactionLines(dashboard),
		outlookEvents: getOutlookEvents(dashboard),
		primaryAction: dashboard.actionInbox[0],
		recoverableCents: overdueInvoiceCents + vendorLeakCents,
		remainingActions: dashboard.actionInbox.slice(1),
		supportNotes: [
			"Closed Cash Action history is not on this overview yet.",
			"Collect-versus-skip outlook scenarios are not modeled in the current 13-week series.",
		],
	};
};

export const formatExploreMoney = (cents: MoneyCents) => formatPreciseCompactCurrency(cents);

export const formatExploreExactMoney = (cents: MoneyCents) => formatCurrency(cents);

export const formatPriorityLabel = (priority: CashAction["priority"]) =>
	`${priority.slice(0, 1).toUpperCase()}${priority.slice(1)}`;

function getCashContextLine(dashboard: DashboardViewModel) {
	const parts = [
		`${formatPreciseCompactCurrency(dashboard.cashAvailableCents)} on hand`,
		`${formatPreciseCompactCurrency(dashboard.cashBufferTargetCents)} buffer`,
	];
	const lowestProjectedCashCents = dashboard.lowestProjectedCashCents;
	const lowestProjectedCashDate = dashboard.lowestProjectedCashDate;

	if (lowestProjectedCashCents !== undefined && lowestProjectedCashDate) {
		parts.push(
			`lowest ${formatPreciseCompactCurrency(lowestProjectedCashCents)} on ${formatDashboardDate(lowestProjectedCashDate)}`,
		);
	}

	return parts.join(" · ");
}

function getInactionLines(dashboard: DashboardViewModel) {
	const lines: string[] = [];

	if (dashboard.invoiceRiskCents > 0) {
		lines.push(`${formatPreciseCompactCurrency(dashboard.invoiceRiskCents)} in overdue invoices stays uncollected`);
	}

	const lowestProjectedCashCents = dashboard.lowestProjectedCashCents;
	const lowestProjectedCashDate = dashboard.lowestProjectedCashDate;

	if (lowestProjectedCashCents !== undefined && lowestProjectedCashDate) {
		lines.push(
			`Lowest week remains ${formatPreciseCompactCurrency(lowestProjectedCashCents)} on ${formatDashboardDate(lowestProjectedCashDate)}`,
		);
	}

	if (dashboard.vendorLeakSavingsCents > 0) {
		lines.push(`${formatPreciseCompactCurrency(dashboard.vendorLeakSavingsCents)} in vendor leaks keeps billing`);
	}

	if (dashboard.pendingApprovalCount > 0) {
		const pendingAmountCents = dashboard.pendingApprovals.reduce(
			(totalCents, request) => totalCents + request.amountCents,
			0,
		);

		lines.push(
			`${dashboard.pendingApprovalCount} spend ${dashboard.pendingApprovalCount === 1 ? "request" : "requests"} totaling ${formatPreciseCompactCurrency(pendingAmountCents)} stays undecided`,
		);
	}

	return lines;
}

function getOutlookEvents(dashboard: DashboardViewModel) {
	return dashboard.forecastChartData.map((point) => ({
		dateLabel: formatDashboardDate(point.week),
		endingLabel: formatCurrencyDollars(point.balance),
		inflowLabel: formatCurrencyDollars(point.inflow),
		isLowest: point.week === dashboard.lowestProjectedCashDate,
		netDollars: point.inflow - point.outflow,
		netLabel: formatCurrencyDollars(Math.abs(point.inflow - point.outflow)),
		outflowLabel: formatCurrencyDollars(point.outflow),
		week: point.week,
	}));
}
