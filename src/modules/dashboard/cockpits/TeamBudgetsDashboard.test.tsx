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

		expect(screen.getByText(formatPreciseCompactCurrency(presentation.monthlyBudgetCents))).toBeVisible();
		expect(screen.getByText(formatPreciseCompactCurrency(presentation.remainingCents))).toBeVisible();
		expect(primaryTeam).toBeDefined();
		expect(screen.getByRole("heading", { name: primaryTeam?.team })).toBeVisible();
		expect(screen.getByText(`${getPercentage(primaryTeam?.usagePercent ?? 0)} used`)).toBeVisible();

		for (const team of presentation.remainingTeams) {
			expect(screen.getAllByText(team.team).length).toBeGreaterThan(0);
		}
	});

	it("keeps the status card when no team budgets exist", () => {
		const presentation = buildTeamBudgetsPresentation(DEMO_WORKSPACE_DATASET);

		render(
			<TeamBudgetsDashboard
				dataset={{
					...DEMO_WORKSPACE_DATASET,
					teamBudgets: [],
				}}
			/>,
		);

		expect(screen.queryByRole("heading", { name: presentation.primaryTeam?.team })).not.toBeInTheDocument();
		expect(screen.queryByText(formatPreciseCompactCurrency(presentation.monthlyBudgetCents))).not.toBeInTheDocument();
	});
});
