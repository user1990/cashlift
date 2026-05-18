import { centsToDollars } from "@/modules/money/format";
import type { CompanyRole, FinancialDataset, SpendRequest } from "@/modules/workspace/types";
import {
	getCashBufferRisk,
	getDueVendorBills,
	getEndingBalance,
	getInvoiceRiskTotal,
	getPendingApprovalCount,
	getRunwayDays,
	getSpendRequestCashImpact,
	getTeamBudgetRemaining,
	getTeamBudgetUsage,
	getUpcomingInvoiceTotal,
	getUpcomingOutflowTotal,
	getVendorLeakSavings,
	getVisibleCashActions,
	isInvoiceOverdue,
	isVendorLeak,
} from "@/modules/workspace/utils";

type BuildDashboardViewModelParams = {
	dataset: FinancialDataset;
	date?: Date;
	role?: CompanyRole;
};

export const buildDashboardViewModel = ({
	dataset,
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
		remainingCents: getTeamBudgetRemaining(budget),
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
	const primaryFinanceUser =
		dataset.teamMembers.find((member) => member.role === "owner-finance") ?? dataset.teamMembers[0];

	return {
		actionInbox: getVisibleCashActions(dataset, role),
		budgetRows,
		cashAtRiskCents: getCashBufferRisk(dataset, date) + getInvoiceRiskTotal(dataset.invoices, date),
		cashAvailableCents: dataset.profile.cashBalanceCents,
		companyName: dataset.profile.name,
		dateRangeLabel: getDateRangeLabel(dataset.forecast),
		dueVendorBills,
		endingCashBalanceCents,
		forecastChartData,
		greetingName: primaryFinanceUser?.name ?? dataset.profile.name,
		invoiceRiskCents: getInvoiceRiskTotal(dataset.invoices, date),
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

	const startDate = new Date(`${forecast[0].date}T00:00:00`);
	const endDate = new Date(`${forecast[forecast.length - 1].date}T00:00:00`);
	const formatter = new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short" });

	return `${formatter.format(startDate)} - ${formatter.format(endDate)}, ${endDate.getFullYear()}`;
}

function getDefaultDashboardDate(dataset: FinancialDataset) {
	const firstForecastDate = dataset.forecast[0]?.date;

	return firstForecastDate ? new Date(`${firstForecastDate}T00:00:00`) : new Date();
}
