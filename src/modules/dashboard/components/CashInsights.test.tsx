// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { formatCurrency, formatPreciseCompactCurrency } from "@/modules/money/format";
import { DEMO_WORKSPACE_DATASET } from "@/modules/workspace/demoDataset";
import { buildCashInsightsPresentation } from "../explore/cashInsightsModel";
import { buildDashboardViewModel } from "../view-model";
import { CashInsights } from "./CashInsights";

describe("CashInsights", () => {
	it("renders cash position, payroll, and outlook from the current dataset", () => {
		const dashboard = buildDashboardViewModel({
			dataset: DEMO_WORKSPACE_DATASET,
			date: new Date("2024-05-20T00:00:00"),
			role: "owner-finance",
		});
		const presentation = buildCashInsightsPresentation(dashboard);

		render(<CashInsights dataset={DEMO_WORKSPACE_DATASET} />);

		expect(screen.getAllByText(formatPreciseCompactCurrency(dashboard.cashAvailableCents)).length).toBeGreaterThan(0);
		expect(screen.getAllByText(formatPreciseCompactCurrency(dashboard.cashBufferTargetCents)).length).toBeGreaterThan(
			0,
		);
		expect(screen.getAllByText(formatPreciseCompactCurrency(dashboard.monthlyPayrollCents)).length).toBeGreaterThan(0);
		expect(screen.getByText(formatCurrency(presentation.surplusCents))).toBeVisible();
		expect(screen.getByText(formatCurrency(dashboard.monthlyPayrollCents))).toBeVisible();
		expect(
			screen.getByRole("progressbar", {
				name: `Cash buffer · ${presentation.bufferShareLabel} of cash on hand`,
			}),
		).toBeVisible();
		expect(screen.getAllByRole("link").map((link) => link.getAttribute("href"))).toEqual(
			expect.arrayContaining(["#cash-outlook", "/dashboard"]),
		);
	});

	it("shows the cash buffer shortfall from the current dataset", () => {
		const dataset = {
			...DEMO_WORKSPACE_DATASET,
			profile: {
				...DEMO_WORKSPACE_DATASET.profile,
				cashBalanceCents: 8_000_000,
				cashBufferTargetCents: 14_000_000,
			},
		};

		render(<CashInsights dataset={dataset} />);

		expect(screen.getByText(formatCurrency(6_000_000))).toBeVisible();
	});
});
