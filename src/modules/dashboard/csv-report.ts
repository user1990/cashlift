import { formatCurrency } from "@/modules/money/format";
import type { FinancialDataset, WorkspaceDatasetDateRange } from "@/modules/workspace/types";
import type { DashboardViewModel } from "./types";

type BuildOverviewCsvReportParams = {
	dashboard: DashboardViewModel;
	dataset: FinancialDataset;
	dateRange?: WorkspaceDatasetDateRange;
	generatedAt?: Date;
};

type CsvRow = (number | string | undefined)[];

const generatedAtFormatter = new Intl.DateTimeFormat("en-US", {
	dateStyle: "medium",
	timeStyle: "short",
	timeZone: "UTC",
});

export function buildOverviewCsvReport({
	dashboard,
	dataset,
	dateRange,
	generatedAt = new Date(),
}: BuildOverviewCsvReportParams) {
	const rangeLabel = getReportRangeLabel(dateRange, dashboard.dateRangeLabel);
	const rows: CsvRow[] = [
		["CashLift overview export"],
		["Company", dashboard.companyName],
		["Date range", rangeLabel],
		["Generated at", generatedAtFormatter.format(generatedAt)],
		[],
		["Summary"],
		["Metric", "Value", "Value cents"],
		["Cash available", formatCurrency(dashboard.cashAvailableCents), dashboard.cashAvailableCents],
		["Ending cash balance", formatCurrency(dashboard.endingCashBalanceCents), dashboard.endingCashBalanceCents],
		["Projected receivables", formatCurrency(dashboard.projectedReceivablesCents), dashboard.projectedReceivablesCents],
		["Projected outflow", formatCurrency(dashboard.projectedOutflowCents), dashboard.projectedOutflowCents],
		["Cash at risk", formatCurrency(dashboard.cashAtRiskCents), dashboard.cashAtRiskCents],
		["Invoice risk", formatCurrency(dashboard.invoiceRiskCents), dashboard.invoiceRiskCents],
		["Vendor leak savings", formatCurrency(dashboard.vendorLeakSavingsCents), dashboard.vendorLeakSavingsCents],
		["Runway days", String(dashboard.runwayDays)],
		["Pending approvals", String(dashboard.pendingApprovalCount)],
		[],
		["Cash outlook"],
		["Date", "Inflow", "Inflow cents", "Outflow", "Outflow cents", "Ending balance", "Ending balance cents"],
		...dataset.forecast.map(({ date, inflowCents, openingBalanceCents, outflowCents }) => {
			const endingBalanceCents = openingBalanceCents + inflowCents - outflowCents;

			return [
				date,
				formatCurrency(inflowCents),
				inflowCents,
				formatCurrency(outflowCents),
				outflowCents,
				formatCurrency(endingBalanceCents),
				endingBalanceCents,
			];
		}),
		[],
		["Team budgets"],
		[
			"Team",
			"Approved",
			"Approved cents",
			"Committed",
			"Committed cents",
			"Remaining",
			"Remaining cents",
			"Usage percent",
		],
		...dashboard.budgetRows.map(
			({ approvedCents, committedCents, remainingCents, team, usagePercent }) =>
				[
					team,
					formatCurrency(approvedCents),
					approvedCents,
					formatCurrency(committedCents),
					committedCents,
					formatCurrency(remainingCents),
					remainingCents,
					usagePercent,
				] satisfies CsvRow,
		),
		[],
		["Spend requests"],
		["Vendor", "Requester", "Team", "Category", "Status", "Needed by", "Amount", "Amount cents", "Reason"],
		...dataset.spendRequests.map(
			({ amountCents, category, neededByDate, reason, requester, status, team, vendor }) =>
				[
					vendor,
					requester,
					team,
					category,
					status,
					neededByDate,
					formatCurrency(amountCents),
					amountCents,
					reason,
				] satisfies CsvRow,
		),
		[],
		["Invoices"],
		["Client", "Owner", "Status", "Due date", "Amount", "Amount cents", "Collection probability"],
		...dataset.invoices.map(
			({ amountCents, client, collectionProbability, dueDate, owner, status }) =>
				[
					client,
					owner,
					status,
					dueDate,
					formatCurrency(amountCents),
					amountCents,
					`${collectionProbability}%`,
				] satisfies CsvRow,
		),
		[],
		["Vendor leaks"],
		["Vendor", "Owner", "Status", "Renewal date", "Usage percent", "Amount", "Amount cents"],
		...dashboard.vendorLeaks.map(
			({ amountCents, owner, renewalDate, status, usagePercent, vendor }) =>
				[
					vendor,
					owner,
					status,
					renewalDate,
					`${usagePercent}%`,
					formatCurrency(amountCents),
					amountCents,
				] satisfies CsvRow,
		),
		[],
		["Due vendor bills"],
		["Vendor", "Category", "Status", "Due date", "Essential", "Amount", "Amount cents"],
		...dashboard.dueVendorBills.map(
			({ amountCents, category, dueDate, essential, status, vendor }) =>
				[
					vendor,
					category,
					status,
					dueDate,
					essential ? "Yes" : "No",
					formatCurrency(amountCents),
					amountCents,
				] satisfies CsvRow,
		),
		[],
		["Action inbox"],
		["Title", "Owner", "Priority", "Status", "Type", "Due date", "Impact", "Impact cents", "Description"],
		...dashboard.actionInbox.map(
			({ description, dueDate, impactCents, owner, priority, status, title, type }) =>
				[
					title,
					owner,
					priority,
					status,
					type,
					dueDate,
					formatCurrency(impactCents),
					impactCents,
					description,
				] satisfies CsvRow,
		),
	];

	return {
		content: rows.map(formatCsvRow).join("\n"),
		filename: `${slugify(dashboard.companyName)}-overview-${getFilenameRange(dateRange)}.csv`,
	};
}

function getReportRangeLabel(dateRange: WorkspaceDatasetDateRange | undefined, fallbackLabel: string) {
	if (!dateRange) {
		return fallbackLabel;
	}

	return `${dateRange.startDate} to ${dateRange.endDate}`;
}

function getFilenameRange(dateRange: WorkspaceDatasetDateRange | undefined) {
	return dateRange ? `${dateRange.startDate}-to-${dateRange.endDate}` : "current-period";
}

function slugify(value: string) {
	const slug = value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");

	return slug || "cashlift";
}

function formatCsvRow(row: CsvRow) {
	return row.map(formatCsvCell).join(",");
}

function formatCsvCell(value: number | string | undefined) {
	if (value === undefined) {
		return "";
	}

	const text = String(value);

	if (!/[",\n\r]/.test(text)) {
		return text;
	}

	return `"${text.replaceAll('"', '""')}"`;
}
