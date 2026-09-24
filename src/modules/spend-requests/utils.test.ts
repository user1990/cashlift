import { describe, expect, it } from "vitest";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { getPendingApprovalCount, getSpendRequestCashImpact } from "./utils";

describe("spend request utils", () => {
	it("counts pending approvals", () => {
		expect(getPendingApprovalCount(financialDatasetFixture.spendRequests)).toEqual(2);
	});

	it("calculates spend request cash impact", () => {
		expect(getSpendRequestCashImpact(financialDatasetFixture.spendRequests[0], financialDatasetFixture)).toEqual(
			40_520_000,
		);
	});
});
