// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { buildDashboardViewModel } from "../view-model";
import { MetricsSection } from "./MetricsSection";

describe("MetricsSection", () => {
	it("shows cash on hand, the outlook trough, and split money at risk", () => {
		const dashboard = buildDashboardViewModel({
			dataset: financialDatasetFixture,
			date: new Date("2026-05-09"),
			role: "owner-finance",
		});

		render(<MetricsSection dashboard={dashboard} />);

		expect(screen.getByText("Cash on hand")).toBeInTheDocument();
		expect(screen.getByText("$412K")).toBeInTheDocument();
		expect(screen.getByText("Buffer $250K")).toBeInTheDocument();
		expect(screen.getByText("Lowest projected cash")).toBeInTheDocument();
		expect(screen.getByText("$413.1K")).toBeInTheDocument();
		expect(screen.getByText("May 6")).toBeInTheDocument();
		expect(screen.getByText("Money at risk")).toBeInTheDocument();
		expect(screen.getByText("$18.4K overdue")).toBeInTheDocument();
	});

	it("does not invent a trough when the outlook is empty", () => {
		const dashboard = buildDashboardViewModel({
			dataset: {
				...financialDatasetFixture,
				forecast: [],
				invoices: [],
			},
			date: new Date("2026-05-09"),
			role: "owner-finance",
		});

		render(<MetricsSection dashboard={dashboard} />);

		expect(screen.getByText("None")).toBeInTheDocument();
		expect(screen.getByText("No 13-week outlook for this range")).toBeInTheDocument();
		expect(screen.getByText("No overdue invoices or buffer gap")).toBeInTheDocument();
	});
});
