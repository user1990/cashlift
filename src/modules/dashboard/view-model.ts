import { getRemainingTeamBudget, getTeamBudgetUsage } from "@/modules/budgets/utils";
import { getVisibleCashActions } from "@/modules/cash-actions/utils";
import { getEndingBalance } from "@/modules/cash-outlook/utils";
import type { CompanyRole } from "@/modules/company-roles/types";
import { getInvoiceRiskTotal, getUpcomingInvoiceTotal, isInvoiceOverdue } from "@/modules/invoices/utils";
import { centsToDollars, formatPreciseCompactCurrency } from "@/modules/money/format";
import type { MoneyCents } from "@/modules/money/types";
import type { SpendRequest } from "@/modules/spend-requests/types";
import { getPendingApprovalCount, getSpendRequestCashImpact } from "@/modules/spend-requests/utils";
import { getVendorLeakSavings, isVendorLeak } from "@/modules/subscriptions/utils";
import { getCashBufferRisk, getRunwayDays } from "@/modules/workspace/cash";
import { getDueVendorBills, getUpcomingOutflowTotal } from "@/modules/workspace/outflows";
import type { FinancialDataset } from "@/modules/workspace/types";
import { formatDashboardDate } from "./overviewDateRangeLabel";

type BuildDashboardViewModelParams = {
	dataset: FinancialDataset;
	bufferDataset?: FinancialDataset;
	date?: Date;
	role?: CompanyRole;
};

export const buildDashboardViewModel = ({
	dataset,
	bufferDataset = dataset,
	date = getDefaultDashboardDate(dataset),
	role = dataset.profile.defaultRole,
}: BuildDashboardViewModelParams) => {
	const pendingApprovals = dataset.spendRequests.filter((request) => request.status === "pending");
	const vendorLeaks = dataset.subscriptions
		.filter(isVendorLeak)
		.toSorted((left, right) => right.amountCents - left.amountCents);
	const overdueInvoices = dataset.invoices
		.filter((invoice) => isInvoiceOverdue(invoice, date))
		.toSorted((left, right) => right.amountCents - left.amountCents);
	const dueVendorBills = getDueVendorBills(dataset.vendorBills, date);
	const budgetRows = dataset.teamBudgets.map((budget) => ({
		...budget,
		remainingCents: getRemainingTeamBudget(budget),
		usagePercent: getTeamBudgetUsage(budget),
	}));
	const forecastChartData = dataset.forecast.map((point, rowIndex) => ({
		balance: centsToDollars(getEndingBalance(point)),
		inflow: centsToDollars(point.inflowCents),
		outflow: centsToDollars(point.outflowCents),
		rowKey: `${point.date}-${rowIndex}`,
		week: point.date,
	}));
	const spendChartData = budgetRows.map((budget) => ({
		remaining: centsToDollars(budget.remainingCents),
		team: budget.team,
		used: centsToDollars(budget.approvedCents),
	}));
	const totalCommittedSpendCents = budgetRows.reduce((totalCents, budget) => totalCents + budget.committedCents, 0);
	const totalUncommittedCents = Math.max(
		0,
		dataset.profile.cashBalanceCents - totalCommittedSpendCents - dataset.profile.cashBufferTargetCents,
	);
	const endingCashBalanceCents =
		dataset.forecast.length > 0
			? getEndingBalance(dataset.forecast[dataset.forecast.length - 1])
			: dataset.profile.cashBalanceCents;
	const lowestProjectedCash = getLowestProjectedCash(dataset.forecast);
	const cashBufferTargetCents = dataset.profile.cashBufferTargetCents;
	const cashAvailableCents = dataset.profile.cashBalanceCents;
	const bufferRiskCents = getCashBufferRisk(bufferDataset, date);
	const invoiceRiskCents = getInvoiceRiskTotal(dataset.invoices, date);
	const primaryFinanceUser =
		dataset.teamMembers.find((member) => member.role === "owner-finance") ?? dataset.teamMembers[0];

	return {
		actionInbox: getVisibleCashActions(dataset.cashActions, role),
		budgetRows,
		bufferRiskCents,
		cashAtRiskCents: bufferRiskCents + invoiceRiskCents,
		cashAvailableCents,
		cashBufferTargetCents,
		cashPositionHeadline: getCashPositionHeadline({
			availableCents: cashAvailableCents,
			bufferTargetCents: cashBufferTargetCents,
			lowestProjectedCashCents: lowestProjectedCash?.cents,
			lowestProjectedCashDate: lowestProjectedCash?.date,
		}),
		companyName: dataset.profile.name,
		dateRangeLabel: getDateRangeLabel(dataset.forecast),
		dueVendorBills,
		endingCashBalanceCents,
		forecastChartData,
		greetingName: primaryFinanceUser?.name ?? dataset.profile.name,
		invoiceRiskCents,
		lowestProjectedCashCents: lowestProjectedCash?.cents,
		lowestProjectedCashDate: lowestProjectedCash?.date,
		overdueInvoices,
		pendingApprovalCount: getPendingApprovalCount(dataset.spendRequests),
		pendingApprovals: pendingApprovals.map((request) => withCashImpact(request, dataset)),
		projectedOutflowCents: getUpcomingOutflowTotal(dataset, date),
		projectedReceivablesCents: getUpcomingInvoiceTotal(dataset.invoices, date),
		role,
		runwayDays: getRunwayDays(dataset),
		spendChartData,
		totalCommittedSpendCents,
		totalUncommittedCents,
		vendorLeakSavingsCents: getVendorLeakSavings(dataset.subscriptions),
		vendorLeaks,
	};
};

const withCashImpact = (request: SpendRequest, dataset: FinancialDataset) => ({
	...request,
	cashAfterApprovalCents: getSpendRequestCashImpact(request, dataset),
});

function getDateRangeLabel(forecast: FinancialDataset["forecast"]) {
	if (forecast.length === 0) {
		return "Current period";
	}

	const endDate = new Date(`${forecast[forecast.length - 1].date}T00:00:00`);

	return `${formatDashboardDate(forecast[0].date)} - ${formatDashboardDate(forecast[forecast.length - 1].date)}, ${endDate.getFullYear()}`;
}

function getLowestProjectedCash(forecast: FinancialDataset["forecast"]) {
	if (forecast.length === 0) {
		return;
	}

	return forecast.reduce(
		(lowest, point) => {
			const cents = getEndingBalance(point);

			if (cents < lowest.cents) {
				return { cents, date: point.date };
			}

			return lowest;
		},
		{ cents: getEndingBalance(forecast[0]), date: forecast[0].date },
	);
}

function getCashPositionHeadline({
	availableCents,
	bufferTargetCents,
	lowestProjectedCashCents,
	lowestProjectedCashDate,
}: {
	availableCents: MoneyCents;
	bufferTargetCents: MoneyCents;
	lowestProjectedCashCents?: MoneyCents;
	lowestProjectedCashDate?: string;
}) {
	const buffer = formatPreciseCompactCurrency(bufferTargetCents);

	if (lowestProjectedCashDate !== undefined && lowestProjectedCashCents !== undefined) {
		if (lowestProjectedCashCents < bufferTargetCents) {
			return `Cash falls below your ${buffer} buffer on ${formatDashboardDate(lowestProjectedCashDate)}`;
		}

		return `Cash stays above the ${buffer} buffer; lowest week is ${formatPreciseCompactCurrency(lowestProjectedCashCents)} on ${formatDashboardDate(lowestProjectedCashDate)}`;
	}

	if (availableCents < bufferTargetCents) {
		return `Cash on hand is ${formatPreciseCompactCurrency(availableCents)}, below the ${buffer} buffer`;
	}

	return `Cash on hand is ${formatPreciseCompactCurrency(availableCents)} against a ${buffer} buffer`;
}

function getDefaultDashboardDate(dataset: FinancialDataset) {
	const firstForecastDate = dataset.forecast[0]?.date;

	return firstForecastDate ? new Date(`${firstForecastDate}T00:00:00`) : new Date();
}
