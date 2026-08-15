import { describe, expect, it } from "vitest";
import { getRemainingTeamBudget, getTeamBudgetUsage } from "@/modules/budgets/utils";
import { getVisibleCashActions } from "@/modules/cash-actions/utils";
import { getInvoiceRiskTotal, isInvoiceOverdue } from "@/modules/invoices/utils";
import { getPendingApprovalCount, getSpendRequestCashImpact } from "@/modules/spend-requests/utils";
import { getVendorLeakSavings, isVendorLeak } from "@/modules/subscriptions/utils";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { dueWithinWindow } from "@/utilities/dates/dueWithinWindow";
import { getCashBufferRisk } from "./cash";

describe("company finance calculations", () => {
	it("counts pending approvals", () => {
		expect(getPendingApprovalCount(financialDatasetFixture.spendRequests)).toEqual(2);
	});

	it("identifies vendor leaks and sums leak savings", () => {
		const leakIds = financialDatasetFixture.subscriptions.filter(isVendorLeak).map((subscription) => subscription.id);

		expect(leakIds).toEqual(["subscription-notion", "subscription-survey", "subscription-ai-notes"]);
		expect(getVendorLeakSavings(financialDatasetFixture.subscriptions)).toEqual(261_000);
	});

	it("sums overdue invoice risk and excludes paid invoices", () => {
		const date = new Date("2026-05-09");
		const overdueIds = financialDatasetFixture.invoices
			.filter((invoice) => isInvoiceOverdue(invoice, date))
			.map((invoice) => invoice.id);

		expect(overdueIds).toEqual(["invoice-northstar"]);
		expect(getInvoiceRiskTotal(financialDatasetFixture.invoices, date)).toEqual(1_840_000);
	});

	it("checks due dates inside future and overdue windows", () => {
		const date = new Date("2026-05-09");

		expect(dueWithinWindow("2026-05-14", date, 14)).toEqual(true);
		expect(dueWithinWindow("2026-06-14", date, 14)).toEqual(false);
		expect(dueWithinWindow("2026-05-08", date, -1)).toEqual(true);
	});

	it("calculates team budget remaining", () => {
		expect(getRemainingTeamBudget(financialDatasetFixture.teamBudgets[0])).toEqual(940_000);
	});

	it("preserves over-budget and zero-budget semantics", () => {
		expect(getRemainingTeamBudget({ committedCents: 120_000, monthlyBudgetCents: 100_000 })).toEqual(-20_000);
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
	});

	it("sorts visible cash actions by priority for finance users", () => {
		const actions = getVisibleCashActions(financialDatasetFixture.cashActions, "owner-finance");

		expect(actions[0].priority).toEqual("critical");
		expect(actions[0].id).toEqual("action-approval-design-suite");
	});
});
