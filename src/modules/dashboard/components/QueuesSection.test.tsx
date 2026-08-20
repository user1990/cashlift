// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { formatPreciseCompactCurrency } from "@/modules/money/format";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { buildDashboardViewModel } from "../view-model";
import { QueuesSection } from "./QueuesSection";

describe("QueuesSection", () => {
	it("shows collect-or-cut money that matches the overdue invoices and vendor leaks", () => {
		const dashboard = buildDashboardViewModel({
			dataset: financialDatasetFixture,
			date: new Date("2026-05-09"),
			role: "owner-finance",
		});
		const visibleRecoverableCents =
			dashboard.overdueInvoices.reduce((totalCents, invoice) => totalCents + invoice.amountCents, 0) +
			dashboard.vendorLeaks.reduce((totalCents, leak) => totalCents + leak.amountCents, 0);

		render(<QueuesSection dashboard={dashboard} readOnly />);

		expect(screen.getByText(formatPreciseCompactCurrency(visibleRecoverableCents))).toBeInTheDocument();
		expect(screen.getByText("Northstar Labs")).toBeInTheDocument();
		expect(screen.getByText("Notion")).toBeInTheDocument();
		expect(screen.getByText("MeetingAI")).toBeInTheDocument();
		expect(screen.getByText("SurveyStack")).toBeInTheDocument();
	});

	it("renders an empty collect-and-cut state without a recoverable total", () => {
		const dashboard = buildDashboardViewModel({
			dataset: {
				...financialDatasetFixture,
				invoices: [],
				subscriptions: [],
			},
			date: new Date("2026-05-09"),
			role: "owner-finance",
		});

		render(<QueuesSection dashboard={dashboard} readOnly />);

		expect(screen.getByText("No overdue invoices or vendor leaks need action.")).toBeInTheDocument();
		expect(screen.queryByText("To collect or cut")).not.toBeInTheDocument();
	});
});
