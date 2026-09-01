// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { formatPreciseCompactCurrency, getPercentage } from "@/modules/money/format";
import { DEMO_WORKSPACE_DATASET } from "@/modules/workspace/demoDataset";
import { TeamBudgetsDashboard } from "./TeamBudgetsDashboard";
import { buildTeamBudgetsPresentation } from "./teamBudgetsModel";

describe("TeamBudgetsDashboard", () => {
	it("renders the glass cockpit from the current team budgets", () => {
		const presentation = buildTeamBudgetsPresentation(DEMO_WORKSPACE_DATASET);
		const primaryTeam = presentation.primaryTeam;

		render(<TeamBudgetsDashboard dataset={DEMO_WORKSPACE_DATASET} />);

		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(presentation.headline);
		expect(screen.getByText(`${presentation.companyName} · Team budgets`)).toBeVisible();
		expect(screen.getByText("3 teams")).toBeVisible();
		expect(screen.getByText("Monthly budget")).toBeVisible();
		expect(screen.getByText(formatPreciseCompactCurrency(presentation.monthlyBudgetCents))).toBeVisible();
		expect(screen.getByText("Highest usage")).toBeVisible();
		expect(primaryTeam).toBeDefined();
		expect(screen.getByRole("heading", { name: primaryTeam?.team })).toBeVisible();
		expect(screen.getByText(`${getPercentage(primaryTeam?.usagePercent ?? 0)} used`)).toBeVisible();
		expect(screen.getByRole("heading", { name: "Other teams" })).toBeVisible();

		for (const team of presentation.remainingTeams) {
			expect(screen.getAllByText(team.team).length).toBeGreaterThan(0);
		}

		expect(screen.queryByRole("link", { name: "Run leak audit" })).not.toBeInTheDocument();
	});

	it("keeps the status card when no team budgets exist", () => {
		render(
			<TeamBudgetsDashboard
				dataset={{
					...DEMO_WORKSPACE_DATASET,
					teamBudgets: [],
				}}
			/>,
		);

		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("No team budgets for this range.");
		expect(screen.getByText("0 teams")).toBeVisible();
		expect(screen.queryByRole("heading", { name: "Other teams" })).not.toBeInTheDocument();
		expect(screen.queryByText("Monthly budget")).not.toBeInTheDocument();
	});
});
