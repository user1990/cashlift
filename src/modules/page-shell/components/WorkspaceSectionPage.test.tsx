// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { describe, expect, it } from "vitest";
import { buildDashboardViewModel } from "@/modules/dashboard/view-model";
import { formatPreciseCompactCurrency } from "@/modules/money/format";
import { DEMO_WORKSPACE_DATASET } from "@/modules/workspace/demoDataset";
import { WorkspaceSectionPage } from "./WorkspaceSectionPage";

const CASH_FORECAST_DATE = DEMO_WORKSPACE_DATASET.forecast[0]?.date;
const CASH_AVAILABLE = formatPreciseCompactCurrency(
	buildDashboardViewModel({
		dataset: DEMO_WORKSPACE_DATASET,
		date: new Date(`${CASH_FORECAST_DATE}T00:00:00`),
		role: DEMO_WORKSPACE_DATASET.profile.defaultRole,
	}).cashAvailableCents,
);

describe("WorkspaceSectionPage", () => {
	it.each([
		{ name: "Logitech", section: "approvals" as const },
		{ name: "Client Delivery", section: "budgets" as const },
		{ name: CASH_AVAILABLE, section: "cash" as const },
		{ name: "Samira Chen", section: "team" as const },
		{ name: "Notion", section: "vendors" as const },
	])("renders the $section cockpit from the current dataset", ({ name, section }) => {
		render(<WorkspaceSectionPage basePath="/dashboard" dataset={DEMO_WORKSPACE_DATASET} readOnly section={section} />);

		expect(screen.getAllByText(name).length).toBeGreaterThan(0);
		expect(screen.queryByRole("link", { name: "Run leak audit" })).not.toBeInTheDocument();
	});

	it("uses the glass cockpit instead of the workspace section header on invoices", () => {
		render(
			<NuqsTestingAdapter hasMemory>
				<WorkspaceSectionPage basePath="/dashboard" dataset={DEMO_WORKSPACE_DATASET} section="invoices" />
			</NuqsTestingAdapter>,
		);

		expect(screen.queryByRole("link", { name: "Run leak audit" })).not.toBeInTheDocument();
		expect(screen.queryByText("Workspace")).not.toBeInTheDocument();
		expect(screen.queryByRole("heading", { name: "Invoice collection" })).not.toBeInTheDocument();
		expect(screen.getByRole("button", { name: /search for anything in this workspace/i })).toBeVisible();
	});
});
