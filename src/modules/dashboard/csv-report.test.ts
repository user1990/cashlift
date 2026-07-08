import { describe, expect, it } from "vitest";
import { reduceDatasetForDateRange } from "@/modules/workspace/read-models";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { buildOverviewCsvReport } from "./csv-report";
import { buildDashboardViewModel } from "./view-model";

const SELECTED_DATE_RANGE = {
	endDate: "2026-05-20",
	startDate: "2026-05-10",
};
const GENERATED_AT = new Date("2026-05-20T12:00:00Z");

describe("overview CSV report", () => {
	it("builds a sectioned report for the selected dashboard range", () => {
		const dataset = reduceDatasetForDateRange(financialDatasetFixture, SELECTED_DATE_RANGE);
		const dashboard = buildDashboard(dataset);

		const report = buildOverviewCsvReport({
			dashboard,
			dataset,
			dateRange: SELECTED_DATE_RANGE,
			generatedAt: GENERATED_AT,
		});

		expect(report.filename).toEqual("studio-nova-overview-2026-05-10-to-2026-05-20.csv");
		expect(report.content).toContain("Company,Studio Nova");
		expect(report.content).toContain("Date range,2026-05-10 to 2026-05-20");
		expect(report.content).toContain('Generated at,"May 20, 2026, 12:00 PM"');
		expect(report.content).toContain("Summary\nMetric,Value,Value cents");
		expect(report.content).toContain(
			"Cash outlook\nDate,Inflow,Inflow cents,Outflow,Outflow cents,Ending balance,Ending balance cents",
		);
		expect(report.content).toContain('2026-05-13,"$26,000",2600000,"$18,800",1880000,"$420,300",42030000');
		expect(report.content).toContain("Team budgets\nTeam,Approved,Approved cents");
		expect(report.content).toContain(
			"Spend requests\nVendor,Requester,Team,Category,Status,Needed by,Amount,Amount cents,Reason",
		);
		expect(report.content).toContain('Delta,Nora,Client Strategy,travel,pending,2026-05-15,"$2,400",240000');
		expect(report.content).toContain(
			"Invoices\nClient,Owner,Status,Due date,Amount,Amount cents,Collection probability",
		);
		expect(report.content).toContain(
			"Vendor leaks\nVendor,Owner,Status,Renewal date,Usage percent,Amount,Amount cents",
		);
		expect(report.content).toContain("Due vendor bills\nVendor,Category,Status,Due date,Essential,Amount,Amount cents");
		expect(report.content).toContain(
			"Action inbox\nTitle,Owner,Priority,Status,Type,Due date,Impact,Impact cents,Description",
		);
		expect(report.content).not.toContain("BrandForge,Leo,Creative,software,pending,2026-05-09");
	});

	it("escapes CSV cells with commas and quotes", () => {
		const dataset = {
			...financialDatasetFixture,
			profile: {
				...financialDatasetFixture.profile,
				name: 'Studio, "Nova"',
			},
		};
		const dashboard = buildDashboard(dataset);

		const report = buildOverviewCsvReport({
			dashboard,
			dataset,
			generatedAt: GENERATED_AT,
		});

		expect(report.content).toContain('"Studio, ""Nova"""');
		expect(report.filename).toEqual("studio-nova-overview-current-period.csv");
	});

	it("neutralizes formula-leading string cells", () => {
		const dataset = {
			...financialDatasetFixture,
			profile: {
				...financialDatasetFixture.profile,
				name: "@Studio Nova",
			},
			spendRequests: [
				{
					...financialDatasetFixture.spendRequests[0],
					reason: '+cmd|"/C calc"!A0',
					vendor: "=BrandForge",
				},
			],
		};
		const dashboard = buildDashboard(dataset);

		const report = buildOverviewCsvReport({
			dashboard,
			dataset,
			generatedAt: GENERATED_AT,
		});

		expect(report.content).toContain("Company,'@Studio Nova");
		expect(report.content).toContain(
			"Vendor,Requester,Team,Category,Status,Needed by,Amount,Amount cents,Reason\n'=BrandForge,",
		);
		expect(report.content).toContain(`"'+cmd|""/C calc""!A0"`);
	});

	it("keeps sparse reports valid", () => {
		const dataset = getSparseDataset();
		const dashboard = buildDashboard(dataset);

		const report = buildOverviewCsvReport({
			dashboard,
			dataset,
			generatedAt: GENERATED_AT,
		});

		expect(report.content).toContain("CashLift overview export");
		expect(report.content).toContain(
			"Cash outlook\nDate,Inflow,Inflow cents,Outflow,Outflow cents,Ending balance,Ending balance cents",
		);
		expect(report.content).toContain(
			"Spend requests\nVendor,Requester,Team,Category,Status,Needed by,Amount,Amount cents,Reason",
		);
		expect(report.content).toContain("Pending approvals,0");
	});
});

function buildDashboard(dataset = financialDatasetFixture) {
	return buildDashboardViewModel({
		dataset,
		date: new Date("2026-05-10"),
		role: "owner-finance",
	});
}

function getSparseDataset() {
	return {
		...financialDatasetFixture,
		cashActions: [],
		forecast: [],
		invoices: [],
		spendRequests: [],
		subscriptions: [],
		teamBudgets: [],
		vendorBills: [],
	};
}
