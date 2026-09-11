// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
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
		{ name: "Samira Chen", section: "settings" as const },
		{ name: "Samira Chen", section: "team" as const },
		{ name: "Notion", section: "vendors" as const },
	])("renders the $section cockpit from the current dataset", ({ name, section }) => {
		render(<WorkspaceSectionPage basePath="/dashboard" dataset={DEMO_WORKSPACE_DATASET} readOnly section={section} />);

		expect(screen.getAllByText(name).length).toBeGreaterThan(0);
	});
});
