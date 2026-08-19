// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { formatPreciseCompactCurrency } from "@/modules/money/format";
import { DEMO_WORKSPACE_DATASET } from "@/modules/workspace/demoDataset";
import { buildDashboardViewModel } from "../view-model";
import { ExploreDashboard } from "./ExploreDashboard";

describe("ExploreDashboard", () => {
	const dashboard = buildDashboardViewModel({
		dataset: DEMO_WORKSPACE_DATASET,
		date: new Date("2024-05-20T00:00:00"),
		role: "owner-finance",
	});

	it.each([
		["a", dashboard.actionInbox[0]?.title ?? ""],
		["b", formatPreciseCompactCurrency(dashboard.cashAvailableCents)],
		["c", dashboard.cashPositionHeadline],
	] as const)("renders direction %s from the current dataset", (direction, headline) => {
		render(<ExploreDashboard dataset={DEMO_WORKSPACE_DATASET} direction={direction} />);

		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(headline);
		expect(screen.getByRole("link", { name: /open invoices/i })).toHaveAttribute("href", "/dashboard/invoices");
	});

	it("keeps the operating cockpit figures on the current dataset", () => {
		render(<ExploreDashboard dataset={DEMO_WORKSPACE_DATASET} direction="c" />);

		expect(screen.getByText(`${dashboard.runwayDays} days runway`)).toBeVisible();
		expect(screen.getByText("Cash buffer")).toBeVisible();
		expect(screen.getByRole("heading", { name: dashboard.actionInbox[0]?.title })).toBeVisible();
		expect(screen.getByRole("heading", { name: "13-week Cash Outlook" })).toBeVisible();
	});
});
