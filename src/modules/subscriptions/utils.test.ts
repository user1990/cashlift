import { describe, expect, it } from "vitest";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { getVendorLeakSavings, isVendorLeak } from "./utils";

describe("subscription utils", () => {
	it("identifies vendor leaks and sums leak savings", () => {
		const leakIds = financialDatasetFixture.subscriptions.filter(isVendorLeak).map((subscription) => subscription.id);

		expect(leakIds).toEqual(["subscription-notion", "subscription-survey", "subscription-ai-notes"]);
		expect(getVendorLeakSavings(financialDatasetFixture.subscriptions)).toEqual(261_000);
	});
});
