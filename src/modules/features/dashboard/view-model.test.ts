import { describe, expect, it } from "vitest";
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
});
