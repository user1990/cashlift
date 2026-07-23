import { getRemainingTeamBudget } from "@/modules/budgets/utils";
import { formatCurrency } from "@/modules/money/format";
import { WorkspaceMetricCard } from "./WorkspaceMetricCard";

type BudgetMetricCardProps = {
	committedCents: number;
	monthlyBudgetCents: number;
	team: string;
};

export const BudgetMetricCard = ({ committedCents, monthlyBudgetCents, team }: BudgetMetricCardProps) => {
	const remainingCents = getRemainingTeamBudget({ committedCents, monthlyBudgetCents });

	return (
		<WorkspaceMetricCard
			as="article"
			description={remainingCents >= 0 ? "remaining this month" : "over budget"}
			label="Team"
			title={team}
			value={formatCurrency(remainingCents)}
			valueClassName="font-mono text-4xl+ text-panel-foreground"
		/>
	);
};
