import { describe, expect, it } from "vitest";
import { formatPreciseCompactCurrency } from "@/modules/money/format";
import { getVendorLeakSavings } from "@/modules/subscriptions/utils";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { buildVendorsPresentation } from "./vendorsPresentation";

describe("vendors presentation", () => {
	it("derives leak-first headline, ordered leaks, and review-first bills from the current dataset", () => {
		const presentation = buildVendorsPresentation(financialDatasetFixture);
		const leakSavingsCents = getVendorLeakSavings(financialDatasetFixture.subscriptions);

		expect(presentation.leakSavingsCents).toEqual(leakSavingsCents);
		expect(presentation.headline).toContain(formatPreciseCompactCurrency(leakSavingsCents));
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
		const reviewPresentation = buildVendorsPresentation(reviewOnly);
		const scheduledPresentation = buildVendorsPresentation(scheduledOnly);
		const emptyPresentation = buildVendorsPresentation(emptyWork);

		expect(reviewPresentation.primaryLeak).toBeUndefined();
		expect(reviewPresentation.primaryBill?.vendor).toEqual("Studio lease extras");
		expect(scheduledPresentation.headline).toContain(
			formatPreciseCompactCurrency(scheduledPresentation.billsTotalCents),
		);
		expect(emptyPresentation.leaks).toEqual([]);
		expect(emptyPresentation.bills).toEqual([]);
		expect(emptyPresentation.leakSavingsCents).toEqual(0);
		expect(emptyPresentation.billsTotalCents).toEqual(0);
	});
});
