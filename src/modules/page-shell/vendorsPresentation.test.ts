import { describe, expect, it } from "vitest";
import { formatPreciseCompactCurrency } from "@/modules/money/format";
import { getVendorLeakSavings } from "@/modules/subscriptions/utils";
import { DEMO_WORKSPACE_DATASET } from "@/modules/workspace/demoDataset";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { buildVendorsPresentation } from "./vendorsPresentation";

describe("vendors presentation", () => {
	it("derives leak-first headline, ordered leaks, and review-first bills from the current dataset", () => {
		const presentation = buildVendorsPresentation(financialDatasetFixture);
		const leakSavingsCents = getVendorLeakSavings(financialDatasetFixture.subscriptions);

		expect(presentation.headline).toEqual(
			`${formatPreciseCompactCurrency(leakSavingsCents)} in monthly vendor leak savings`,
		);
		expect(presentation.leaks.map((leak) => leak.vendor)).toEqual(["Notion", "MeetingAI", "SurveyStack"]);
		expect(presentation.primaryLeak?.vendor).toEqual("Notion");
		expect(presentation.remainingLeaks.map((leak) => leak.vendor)).toEqual(["MeetingAI", "SurveyStack"]);
		expect(presentation.bills.map((bill) => bill.vendor)).toEqual([
			"Studio lease extras",
			"Freelance bench",
			"Payroll run",
		]);
		expect(presentation.primaryBill).toBeUndefined();
		expect(presentation.activeSubscriptions.map((subscription) => subscription.vendor)).toEqual(["BrandForge"]);
		expect(presentation.billsTotalCents).toEqual(2_340_000);
		expect(presentation.reviewBillsCents).toEqual(320_000);
	});

	it("uses vendor-bill headlines when no leaks remain", () => {
		const withoutLeaks = {
			...financialDatasetFixture,
			subscriptions: financialDatasetFixture.subscriptions.filter((subscription) => subscription.status === "active"),
		};
		const reviewOnly = {
			...withoutLeaks,
			vendorBills: financialDatasetFixture.vendorBills.filter((bill) => bill.status === "needs-review"),
		};
		const scheduledOnly = {
			...withoutLeaks,
			vendorBills: financialDatasetFixture.vendorBills.filter((bill) => bill.status === "scheduled"),
		};
		const emptyWork = {
			...financialDatasetFixture,
			subscriptions: [],
			vendorBills: [],
		};

		expect(buildVendorsPresentation(reviewOnly).headline).toEqual("1 vendor bill needs review");
		expect(buildVendorsPresentation(reviewOnly).primaryBill?.vendor).toEqual("Studio lease extras");
		expect(buildVendorsPresentation(scheduledOnly).headline).toEqual("$12.4K in vendor bills");
		expect(buildVendorsPresentation(emptyWork).headline).toEqual("No vendor leaks or vendor bills need action");
	});

	it("keeps Studio Nova leak savings on the demo dataset", () => {
		const presentation = buildVendorsPresentation(DEMO_WORKSPACE_DATASET);

		expect(presentation.companyName).toEqual("Studio Nova");
		expect(presentation.headline).toEqual("$23K in monthly vendor leak savings");
		expect(presentation.primaryLeak?.vendor).toEqual("Notion");
		expect(presentation.bills.map((bill) => bill.vendor)).toEqual(["Atlassian"]);
	});
});
