import { getRemainingTeamBudget, getTeamBudgetUsage } from "@/modules/budgets/utils";
import { formatPreciseCompactCurrency } from "@/modules/money/format";
import type { MoneyCents } from "@/modules/money/types";
import type { FinancialDataset } from "@/modules/workspace/types";

export type TeamBudgetRow = FinancialDataset["teamBudgets"][number] & {
	remainingCents: MoneyCents;
	usagePercent: number;
};

export const buildTeamBudgetsPresentation = (dataset: FinancialDataset) => {
	const rows = dataset.teamBudgets
		.map((budget) => ({
			...budget,
			remainingCents: getRemainingTeamBudget(budget),
			usagePercent: getTeamBudgetUsage(budget),
		}))
		.toSorted(compareTeamBudgetRows);
	const approvedCents = sumCents(rows, "approvedCents");
	const committedCents = sumCents(rows, "committedCents");
	const monthlyBudgetCents = sumCents(rows, "monthlyBudgetCents");
	const remainingCents = sumCents(rows, "remainingCents");
	const overBudgetRows = rows.filter((row) => row.remainingCents < 0);

	return {
		approvedCents,
		committedCents,
		companyName: dataset.profile.name,
		headline: getTeamBudgetsHeadline({
			overBudgetRows,
			remainingCents,
			teamCount: rows.length,
		}),
		monthlyBudgetCents,
		overBudgetCount: overBudgetRows.length,
		primaryTeam: rows[0],
		remainingCents,
		remainingTeams: rows.slice(1),
		rows,
		teamCount: rows.length,
	};
};

const compareTeamBudgetRows = (left: TeamBudgetRow, right: TeamBudgetRow) => {
	const leftOverBudget = left.remainingCents < 0;
	const rightOverBudget = right.remainingCents < 0;

	if (leftOverBudget !== rightOverBudget) {
		return leftOverBudget ? -1 : 1;
	}

	if (leftOverBudget) {
		return left.remainingCents - right.remainingCents;
	}

	return right.usagePercent - left.usagePercent;
};

const sumCents = (
	rows: TeamBudgetRow[],
	key: "approvedCents" | "committedCents" | "monthlyBudgetCents" | "remainingCents",
) => rows.reduce((totalCents, row) => totalCents + row[key], 0);

function getTeamBudgetsHeadline({
	overBudgetRows,
	remainingCents,
	teamCount,
}: {
	overBudgetRows: TeamBudgetRow[];
	remainingCents: MoneyCents;
	teamCount: number;
}) {
	if (teamCount === 0) {
		return "No team budgets for this range.";
	}

	if (overBudgetRows.length === 1) {
		return `${overBudgetRows[0].team} is over its monthly budget`;
	}

	if (overBudgetRows.length > 1) {
		return `${overBudgetRows.length} teams are over their monthly budgets`;
	}

	if (remainingCents === 0) {
		return "Team budgets are fully committed this month";
	}

	return `Team budgets leave ${formatPreciseCompactCurrency(remainingCents)} uncommitted this month`;
}
