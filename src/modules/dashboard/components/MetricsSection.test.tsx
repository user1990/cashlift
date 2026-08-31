// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { formatPreciseCompactCurrency } from "@/modules/money/format";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { formatDashboardDate } from "../overviewDateRangeLabel";
import { buildDashboardViewModel } from "../view-model";
import { MetricsSection } from "./MetricsSection";

describe("MetricsSection", () => {
	it("shows supplied cash, trough, and at-risk amounts without inventing an empty outlook", () => {
		const dashboard = buildDashboardViewModel({
			dataset: financialDatasetFixture,
			date: new Date("2026-05-09"),
			role: "owner-finance",
		});
		const troughCents = dashboard.lowestProjectedCashCents;
		const troughDate = dashboard.lowestProjectedCashDate;

		if (troughCents === undefined || troughDate === undefined) {
			throw new Error("fixture must include an outlook trough");
		}

		const { unmount } = render(<MetricsSection dashboard={dashboard} />);

		expect(screen.getByText(formatPreciseCompactCurrency(dashboard.cashAvailableCents))).toBeInTheDocument();
		expect(
			screen.getByText(`Buffer ${formatPreciseCompactCurrency(dashboard.cashBufferTargetCents)}`),
		).toBeInTheDocument();
		expect(screen.getByText(formatPreciseCompactCurrency(troughCents))).toBeInTheDocument();
		expect(screen.getByText(formatDashboardDate(troughDate))).toBeInTheDocument();
		expect(screen.getByText(`${formatPreciseCompactCurrency(dashboard.invoiceRiskCents)} overdue`)).toBeInTheDocument();

		unmount();

		render(
			<MetricsSection
				dashboard={buildDashboardViewModel({
					dataset: {
						...financialDatasetFixture,
						forecast: [],
						invoices: [],
					},
					date: new Date("2026-05-09"),
					role: "owner-finance",
				})}
			/>,
		);

		expect(screen.queryByText(formatPreciseCompactCurrency(troughCents))).not.toBeInTheDocument();
		expect(screen.queryByText(formatDashboardDate(troughDate))).not.toBeInTheDocument();
		expect(
			screen.queryByText(`${formatPreciseCompactCurrency(dashboard.invoiceRiskCents)} overdue`),
		).not.toBeInTheDocument();
	});
});
