import { describe, expect, it } from "vitest";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { formatCashAfterApproval, getPendingApprovalCount, getSpendRequestCashImpact } from "./utils";

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

describe("formatCashAfterApproval", () => {
	it("labels shortfall when approval exceeds cash on hand", () => {
		expect(formatCashAfterApproval(-2_000_000)).toEqual("short by $20,000");
	});

	it("formats positive cash after approval", () => {
		expect(formatCashAfterApproval(5_000_000)).toEqual("$50,000");
	});
});
