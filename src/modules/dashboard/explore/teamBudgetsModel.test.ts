import { describe, expect, it } from "vitest";
import { getRemainingTeamBudget, getTeamBudgetUsage } from "@/modules/budgets/utils";
import { formatPreciseCompactCurrency } from "@/modules/money/format";
import { DEMO_WORKSPACE_DATASET } from "@/modules/workspace/demoDataset";
import { buildTeamBudgetsPresentation } from "./teamBudgetsModel";

describe("team budgets presentation", () => {
	it("derives totals, sort, and headline from the current dataset", () => {
		const presentation = buildTeamBudgetsPresentation(DEMO_WORKSPACE_DATASET);
		const remainingCents = DEMO_WORKSPACE_DATASET.teamBudgets.reduce(
			(totalCents, budget) => totalCents + getRemainingTeamBudget(budget),
			0,
		);
		const usageOrder = DEMO_WORKSPACE_DATASET.teamBudgets
			.map((budget) => ({
				id: budget.id,
				usagePercent: getTeamBudgetUsage(budget),
			}))
			.toSorted((left, right) => right.usagePercent - left.usagePercent)
			.map((budget) => budget.id);

		expect(presentation.teamCount).toEqual(DEMO_WORKSPACE_DATASET.teamBudgets.length);
		expect(presentation.remainingCents).toEqual(remainingCents);
		expect(presentation.headline).toContain(formatPreciseCompactCurrency(remainingCents));
		expect(presentation.rows.map((row) => row.id)).toEqual(usageOrder);
		expect(presentation.primaryTeam?.id).toEqual(usageOrder[0]);
		expect(presentation.remainingTeams.map((row) => row.id)).toEqual(usageOrder.slice(1));
		expect(presentation.overBudgetCount).toEqual(0);
	});

	it("surfaces over-budget teams first and names them in the headline", () => {
		const [onTrackBudget, overBudget] = DEMO_WORKSPACE_DATASET.teamBudgets;
		const presentation = buildTeamBudgetsPresentation({
			...DEMO_WORKSPACE_DATASET,
			teamBudgets: [
				{
					...onTrackBudget,
					approvedCents: 80_000,
					committedCents: 80_000,
					monthlyBudgetCents: 100_000,
				},
				{
					...overBudget,
					approvedCents: 150_000,
					committedCents: 150_000,
					monthlyBudgetCents: 100_000,
				},
			],
		});

		expect(presentation.primaryTeam?.team).toEqual(overBudget.team);
		expect(presentation.headline).toContain(overBudget.team);
		expect(presentation.overBudgetCount).toEqual(1);
		expect(presentation.remainingTeams.map((row) => row.team)).toEqual([onTrackBudget.team]);
	});

	it("keeps empty totals when no team budgets exist", () => {
		const presentation = buildTeamBudgetsPresentation({
			...DEMO_WORKSPACE_DATASET,
			teamBudgets: [],
		});

		expect(presentation.primaryTeam).toBeUndefined();
		expect(presentation.rows).toEqual([]);
		expect(presentation.remainingCents).toEqual(0);
	});
});
