import { describe, expect, it } from "vitest";
import { DEMO_WORKSPACE_DATASET } from "@/modules/workspace/demoDataset";
import { reduceDatasetForDateRange } from "@/modules/workspace/read-models";
import { getCashBufferRisk } from "@/modules/workspace/utils";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { buildDashboardViewModel } from "./view-model";

describe("dashboard view model", () => {
	it("builds company cash metrics for a selected date", () => {
		const dashboard = buildDashboardViewModel({
			dataset: financialDatasetFixture,
			date: new Date("2026-05-09"),
			role: "owner-finance",
		});

		expect(dashboard.cashAvailableCents).toEqual(41_200_000);
		expect(dashboard.pendingApprovalCount).toEqual(2);
		expect(dashboard.invoiceRiskCents).toEqual(1_840_000);
		expect(dashboard.vendorLeakSavingsCents).toEqual(261_000);
		expect(dashboard.forecastChartData).toHaveLength(financialDatasetFixture.forecast.length);
		expect(dashboard.totalCommittedSpendCents).toBeGreaterThan(0);
	});

	it("orders action inbox by cash risk", () => {
		const dashboard = buildDashboardViewModel({
			dataset: financialDatasetFixture,
			date: new Date("2026-05-09"),
			role: "owner-finance",
		});

		expect(dashboard.actionInbox[0].priority).toEqual("critical");
		expect(dashboard.actionInbox[0].title).toEqual("Decide on BrandForge annual renewal");
	});

	it("keeps the 14-day buffer risk when the overview range is shorter", () => {
		const riskDataset = {
			...financialDatasetFixture,
			invoices: [],
			profile: {
				...financialDatasetFixture.profile,
				cashBalanceCents: 26_000_000,
			},
		};
		const date = new Date("2026-05-09");
		const dashboard = buildDashboardViewModel({
			bufferDataset: riskDataset,
			dataset: reduceDatasetForDateRange(riskDataset, { endDate: "2026-05-09", startDate: "2026-05-09" }),
			date,
			role: "owner-finance",
		});

		expect(dashboard.cashAtRiskCents).toEqual(getCashBufferRisk(riskDataset, date));
		expect(dashboard.cashAtRiskCents).toBeGreaterThan(0);
	});

	it("returns stable fallbacks when company activity is empty", () => {
		const dashboard = buildDashboardViewModel({
			dataset: {
				...financialDatasetFixture,
				cashActions: [],
				forecast: [],
				invoices: [],
				spendRequests: [],
				subscriptions: [],
				teamBudgets: [],
				vendorBills: [],
			},
			date: new Date("2026-05-09"),
			role: "owner-finance",
		});

		expect(dashboard.actionInbox).toEqual([]);
		expect(dashboard.forecastChartData).toEqual([]);
		expect(dashboard.invoiceRiskCents).toEqual(0);
		expect(dashboard.pendingApprovalCount).toEqual(0);
		expect(dashboard.vendorLeaks).toEqual([]);
	});

	it("shows employee-visible actions only for employee role", () => {
		const dashboard = buildDashboardViewModel({
			dataset: financialDatasetFixture,
			date: new Date("2026-05-09"),
			role: "employee",
		});

		expect(dashboard.actionInbox).toHaveLength(1);
		expect(dashboard.actionInbox[0].id).toEqual("action-upload-receipt");
	});

	it("builds reference demo dashboard fields", () => {
		const dashboard = buildDashboardViewModel({
			dataset: DEMO_WORKSPACE_DATASET,
			date: new Date("2024-05-18"),
			role: "owner-finance",
		});

		expect(dashboard.greetingName).toEqual("Samira Chen");
		expect(dashboard.dateRangeLabel).toEqual("May 20 - Jun 17, 2024");
		expect(dashboard.cashAvailableCents).toEqual(248_000_000);
		expect(dashboard.spendChartData[0]).toMatchObject({
			remaining: 169_000,
			team: "Client Delivery",
			used: 98_000,
		});
	});
});
