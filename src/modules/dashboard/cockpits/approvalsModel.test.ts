import { describe, expect, it } from "vitest";
import { formatPreciseCompactCurrency } from "@/modules/money/format";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { buildDashboardViewModel } from "../view-model";
import { buildApprovalsPresentation } from "./approvalsModel";

describe("approvals presentation", () => {
	it("derives the headline, pending total, and queue split from the current dataset", () => {
		const dashboard = buildDashboardViewModel({
			dataset: financialDatasetFixture,
			date: new Date("2026-05-09T00:00:00"),
			role: "owner-finance",
		});
		const presentation = buildApprovalsPresentation(dashboard);
		const pendingAmountCents = dashboard.pendingApprovals.reduce(
			(totalCents, request) => totalCents + request.amountCents,
			0,
		);

		expect(presentation.headline).toContain(formatPreciseCompactCurrency(pendingAmountCents));
		expect(presentation.pendingAmountCents).toEqual(pendingAmountCents);
		expect(presentation.primaryRequest?.id).toEqual(dashboard.pendingApprovals[0]?.id);
		expect(presentation.remainingRequests.map((request) => request.id)).toEqual(
			dashboard.pendingApprovals.slice(1).map((request) => request.id),
		);
	});

	it("clears the queue when no spend requests are pending", () => {
		const dashboard = buildDashboardViewModel({
			dataset: {
				...financialDatasetFixture,
				spendRequests: financialDatasetFixture.spendRequests.map((request) => ({
					...request,
					status: "approved",
				})),
			},
			date: new Date("2026-05-09T00:00:00"),
			role: "owner-finance",
		});
		const presentation = buildApprovalsPresentation(dashboard);

		expect(presentation.primaryRequest).toBeUndefined();
		expect(presentation.remainingRequests).toEqual([]);
		expect(presentation.pendingAmountCents).toEqual(0);
	});
});
