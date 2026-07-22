import { describe, expect, it } from "vitest";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { dueWithinWindow } from "@/utilities/dates/dueWithinWindow";
import {
	getCashBufferRisk,
	getInvoiceRiskTotal,
	getPendingApprovalCount,
	getRunwayDays,
	getSpendRequestCashImpact,
	getTeamBudgetRemaining,
	getTeamBudgetUsage,
	getVendorLeakSavings,
	getVisibleCashActions,
	isInvoiceOverdue,
	isVendorLeak,
} from "./utils";

describe("company finance calculations", () => {
	it("counts pending approvals", () => {
		expect(getPendingApprovalCount(financialDatasetFixture.spendRequests)).toEqual(2);
	});

	it("calculates overdue invoice risk", () => {
		expect(getInvoiceRiskTotal(financialDatasetFixture.invoices, new Date("2026-05-09"))).toEqual(1_840_000);
	});

	it("detects vendor leak savings", () => {
		expect(getVendorLeakSavings(financialDatasetFixture.subscriptions)).toEqual(261_000);
	});

	it("identifies vendor leaks from unused, duplicate, and low-use trial subscriptions (single iteration)", () => {
		const expectedIds = ["subscription-notion", "subscription-survey", "subscription-ai-notes"];
		const resultIds = [];
		for (const subscription of financialDatasetFixture.subscriptions) {
			if (isVendorLeak(subscription)) {
				resultIds.push(subscription.id);
			}
		}
		expect(resultIds).toEqual(expectedIds);
	});

	it("identifies overdue invoices without treating paid historical invoices as risk (single iteration)", () => {
		const date = new Date("2026-05-09");
		const expectedIds = ["invoice-northstar"];
		const resultIds = [];
		for (const invoice of financialDatasetFixture.invoices) {
			if (isInvoiceOverdue(invoice, date)) {
				resultIds.push(invoice.id);
			}
		}
		expect(resultIds).toEqual(expectedIds);
	});

	it("checks due dates inside future and overdue windows", () => {
		const date = new Date("2026-05-09");

		expect(dueWithinWindow("2026-05-14", date, 14)).toEqual(true);
		expect(dueWithinWindow("2026-06-14", date, 14)).toEqual(false);
		expect(dueWithinWindow("2026-05-08", date, -1)).toEqual(true);
	});

	it("calculates team budget remaining", () => {
		expect(getTeamBudgetRemaining(financialDatasetFixture.teamBudgets[0])).toEqual(940_000);
	});

	it("preserves over-budget and zero-budget semantics", () => {
		expect(getTeamBudgetRemaining({ committedCents: 120_000, monthlyBudgetCents: 100_000 })).toEqual(-20_000);
		expect(
			getTeamBudgetUsage({ ...financialDatasetFixture.teamBudgets[0], committedCents: 1, monthlyBudgetCents: 0 }),
		).toEqual(0);
	});

	it("calculates spend request cash impact", () => {
		expect(getSpendRequestCashImpact(financialDatasetFixture.spendRequests[0], financialDatasetFixture)).toEqual(
			40_520_000,
		);
	});

	it("keeps cash buffer risk at zero when projected cash stays above target", () => {
		expect(getCashBufferRisk(financialDatasetFixture, new Date("2026-05-09"))).toEqual(0);
		expect(getRunwayDays(financialDatasetFixture)).toBeGreaterThan(50);
	});

	it("sorts visible cash actions by priority for finance users", () => {
		const actions = getVisibleCashActions(financialDatasetFixture.cashActions, "owner-finance");

		expect(actions[0].priority).toEqual("critical");
		expect(actions[0].id).toEqual("action-approval-design-suite");
	});
});
