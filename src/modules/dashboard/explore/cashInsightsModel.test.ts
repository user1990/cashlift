import { describe, expect, it } from "vitest";
import { getPercentage } from "@/modules/money/format";
import { DEMO_WORKSPACE_DATASET } from "@/modules/workspace/demoDataset";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { buildDashboardViewModel } from "../view-model";
import { buildCashInsightsPresentation } from "./cashInsightsModel";

describe("cash insights presentation", () => {
	it("derives buffer coverage, payroll share, and cash work from the current dataset", () => {
		const dashboard = buildDashboardViewModel({
			dataset: DEMO_WORKSPACE_DATASET,
			date: new Date("2024-05-20T00:00:00"),
			role: "owner-finance",
		});
		const presentation = buildCashInsightsPresentation(dashboard);
		const surplusCents = dashboard.cashAvailableCents - dashboard.cashBufferTargetCents;
		const payrollSharePercent = (dashboard.monthlyPayrollCents / dashboard.cashAvailableCents) * 100;
		const bufferSharePercent = (dashboard.cashBufferTargetCents / dashboard.cashAvailableCents) * 100;

		expect(presentation.aboveBuffer).toEqual(true);
		expect(presentation.surplusCents).toEqual(surplusCents);
		expect(presentation.shortfallCents).toEqual(0);
		expect(presentation.payrollShareLabel).toEqual(getPercentage(payrollSharePercent));
		expect(presentation.bufferShareLabel).toEqual(getPercentage(bufferSharePercent));
		expect(presentation.cashWork).toBeUndefined();
	});

	it("marks the cash buffer as short when cash on hand is below the target", () => {
		const dashboard = buildDashboardViewModel({
			dataset: {
				...financialDatasetFixture,
				profile: {
					...financialDatasetFixture.profile,
					cashBalanceCents: 10_000_000,
					cashBufferTargetCents: 25_000_000,
				},
			},
			date: new Date("2026-05-09"),
			role: "owner-finance",
		});
		const presentation = buildCashInsightsPresentation(dashboard);

		expect(presentation.aboveBuffer).toEqual(false);
		expect(presentation.shortfallCents).toEqual(15_000_000);
		expect(presentation.surplusCents).toEqual(0);
		expect(presentation.cashWork?.type).toEqual("cash-buffer");
	});
});
