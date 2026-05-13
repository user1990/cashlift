import { differenceInCalendarDays, parseISO } from "date-fns";
import type {
	ActionPriority,
	CompanyRole,
	FinancialDataset,
	ForecastPoint,
	Invoice,
	SpendRequest,
	Subscription,
	TeamBudget,
	VendorBill,
} from "./types";

const DAYS_IN_MONTH = 30;

const ACTION_PRIORITY_WEIGHTS: Record<ActionPriority, number> = {
	critical: 4,
	high: 3,
	medium: 2,
	low: 1,
};

const sumAmounts = <Item>(items: Item[], getAmountCents: (item: Item) => number) =>
	items.reduce((total, item) => total + getAmountCents(item), 0);

export const getPendingApprovalCount = (requests: SpendRequest[]) =>
	requests.filter((request) => request.status === "pending").length;

const isInvoiceOutstanding = (invoice: Invoice) => invoice.status !== "paid";

export const isInvoiceOverdue = (invoice: Invoice, date = new Date()) => {
	if (!isInvoiceOutstanding(invoice)) {
		return false;
	}

	return invoice.status === "overdue" || dueWithinWindow(invoice.dueDate, date, -1);
};

export const getInvoiceRiskTotal = (invoices: Invoice[], date = new Date()) =>
	sumAmounts(
		invoices.filter((invoice) => isInvoiceOverdue(invoice, date)),
		(invoice) => invoice.amountCents,
	);

export const getUpcomingInvoiceTotal = (invoices: Invoice[], date = new Date(), days = 14) =>
	sumAmounts(
		invoices.filter((invoice) => isInvoiceOutstanding(invoice) && dueWithinWindow(invoice.dueDate, date, days)),
		(invoice) => invoice.amountCents,
	);

export const isVendorLeak = (subscription: Subscription) =>
	subscription.status === "unused" ||
	subscription.status === "duplicate" ||
	(subscription.status === "trial" && subscription.usagePercent < 25);

export const getVendorLeakSavings = (subscriptions: Subscription[]) =>
	sumAmounts(subscriptions.filter(isVendorLeak), (subscription) => subscription.amountCents);

export const getTeamBudgetRemaining = ({
	committedCents,
	monthlyBudgetCents,
}: Pick<TeamBudget, "committedCents" | "monthlyBudgetCents">) => Math.max(0, monthlyBudgetCents - committedCents);

export const getTeamBudgetUsage = (budget: TeamBudget) =>
	budget.monthlyBudgetCents === 0 ? 0 : (budget.committedCents / budget.monthlyBudgetCents) * 100;

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

export const getSpendRequestCashImpact = (request: SpendRequest, dataset: FinancialDataset) =>
	dataset.profile.cashBalanceCents - request.amountCents;

export const getVisibleCashActions = (dataset: FinancialDataset, role: CompanyRole) =>
	dataset.cashActions
		.filter((action) => action.status === "open" && action.visibleTo.includes(role))
		.toSorted((left, right) => {
			const priorityDelta = ACTION_PRIORITY_WEIGHTS[right.priority] - ACTION_PRIORITY_WEIGHTS[left.priority];

			if (priorityDelta !== 0) {
				return priorityDelta;
			}

			const dateDelta = parseISO(left.dueDate).getTime() - parseISO(right.dueDate).getTime();

			if (dateDelta !== 0) {
				return dateDelta;
			}

			return right.impactCents - left.impactCents;
		});

export const getEndingBalance = (point: ForecastPoint) =>
	point.openingBalanceCents + point.inflowCents - point.outflowCents;

export const getDueVendorBills = (bills: VendorBill[], date = new Date(), days = 14) =>
	bills
		.filter((bill) => dueWithinWindow(bill.dueDate, date, days))
		.toSorted((left, right) => parseISO(left.dueDate).getTime() - parseISO(right.dueDate).getTime());

export const dueWithinWindow = (dueDate: string, date: Date, days: number) => {
	const daysUntilDue = differenceInCalendarDays(parseISO(dueDate), date);

	return days < 0 ? daysUntilDue < 0 : daysUntilDue >= 0 && daysUntilDue <= days;
};
