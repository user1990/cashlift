import type { CompanyRole, FinancialDataset, SpendRequest } from "@/modules/base/finance/types";
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
} from "@/modules/base/finance/utils";
import { centsToDollars } from "@/modules/common/money/format";

type BuildDashboardViewModelParams = {
	dataset: FinancialDataset;
	date?: Date;
	role?: CompanyRole;
};

export const buildDashboardViewModel = ({
	dataset,
	date = new Date(),
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
		approved: centsToDollars(budget.approvedCents),
		committed: centsToDollars(budget.committedCents),
		team: budget.team,
	}));

	return {
		actionInbox: getVisibleCashActions(dataset, role),
		budgetRows,
		cashAtRiskCents: getCashBufferRisk(dataset, date) + getInvoiceRiskTotal(dataset.invoices, date),
		cashAvailableCents: dataset.profile.cashBalanceCents,
		companyName: dataset.profile.name,
		dueVendorBills,
		forecastChartData,
		invoiceRiskCents: getInvoiceRiskTotal(dataset.invoices, date),
		overdueInvoices,
		pendingApprovalCount: getPendingApprovalCount(dataset.spendRequests),
		pendingApprovals: pendingApprovals.map((request) => withCashImpact(request, dataset)),
		projectedOutflowCents: getUpcomingOutflowTotal(dataset, date),
		projectedReceivablesCents: getUpcomingInvoiceTotal(dataset.invoices, date),
		role,
		runwayDays: getRunwayDays(dataset),
		spendChartData,
		vendorLeakSavingsCents: getVendorLeakSavings(dataset.subscriptions),
		vendorLeaks,
	};
};

const withCashImpact = (request: SpendRequest, dataset: FinancialDataset) => ({
	...request,
	cashAfterApprovalCents: getSpendRequestCashImpact(request, dataset),
});
