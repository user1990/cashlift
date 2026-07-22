import { formatCurrency } from "@/modules/money/format";
import { getTeamBudgetRemaining } from "@/modules/workspace/utils";
import { WorkspaceMetricCard } from "./WorkspaceMetricCard";

type BudgetMetricCardProps = {
	committedCents: number;
	monthlyBudgetCents: number;
	team: string;
};

export const BudgetMetricCard = ({ committedCents, monthlyBudgetCents, team }: BudgetMetricCardProps) => {
	const remainingCents = getTeamBudgetRemaining({ committedCents, monthlyBudgetCents });
	const overBudget = remainingCents < 0;

	return (
		<WorkspaceMetricCard
			as="article"
			description={overBudget ? "over budget" : "remaining this month"}
			label="Team"
			title={team}
			value={formatCurrency(Math.abs(remainingCents))}
			valueClassName="font-mono text-4xl+ text-panel-foreground"
		/>
	);
};
