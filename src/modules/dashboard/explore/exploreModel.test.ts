import { describe, expect, it } from "vitest";
import { formatPreciseCompactCurrency } from "@/modules/money/format";
import { DEMO_WORKSPACE_DATASET } from "@/modules/workspace/demoDataset";
import { formatDashboardDate } from "../overviewDateRangeLabel";
import { buildDashboardViewModel } from "../view-model";
import { buildExplorePresentation } from "./exploreModel";

describe("explore presentation", () => {
	it("derives cash context, inaction, and recoverable totals from the current dataset", () => {
		const dashboard = buildDashboardViewModel({
			dataset: DEMO_WORKSPACE_DATASET,
			date: new Date("2024-05-20T00:00:00"),
			role: "owner-finance",
		});
		const presentation = buildExplorePresentation(dashboard);
		const overdueInvoiceCents = dashboard.overdueInvoices.reduce(
			(totalCents, invoice) => totalCents + invoice.amountCents,
			0,
		);
		const vendorLeakCents = dashboard.vendorLeaks.reduce((totalCents, leak) => totalCents + leak.amountCents, 0);

		expect(presentation.primaryAction?.title).toEqual(dashboard.actionInbox[0]?.title);
		expect(presentation.remainingActions.map((action) => action.id)).toEqual(
			dashboard.actionInbox.slice(1).map((action) => action.id),
		);
		expect(presentation.cashContextLine).toContain(formatPreciseCompactCurrency(dashboard.cashAvailableCents));
		expect(presentation.cashContextLine).toContain(formatPreciseCompactCurrency(dashboard.cashBufferTargetCents));
		expect(presentation.recoverableCents).toEqual(overdueInvoiceCents + vendorLeakCents);
		expect(presentation.inactionLines).toEqual([
			`${formatPreciseCompactCurrency(dashboard.invoiceRiskCents)} in overdue invoices stays uncollected`,
			`Lowest week remains ${formatPreciseCompactCurrency(dashboard.lowestProjectedCashCents ?? 0)} on ${formatDashboardDate(dashboard.lowestProjectedCashDate ?? "")}`,
			`${formatPreciseCompactCurrency(dashboard.vendorLeakSavingsCents)} in vendor leaks keeps billing`,
			`1 spend request totaling ${formatPreciseCompactCurrency(dashboard.pendingApprovals[0]?.amountCents ?? 0)} stays undecided`,
		]);
		expect(presentation.outlookEvents.map((event) => event.week)).toEqual(
			dashboard.forecastChartData.map((point) => point.week),
		);
	});
});
