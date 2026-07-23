import type { FinancialDataset } from "@/modules/workspace/types";
import { BudgetMetricCard } from "./BudgetMetricCard";
import { WorkspaceCardGrid } from "./WorkspaceCardGrid";

type WorkspaceBudgetsSectionProps = {
	dataset: FinancialDataset;
};

export const WorkspaceBudgetsSection = ({ dataset }: WorkspaceBudgetsSectionProps) => (
	<WorkspaceCardGrid as="ul">
		{dataset.teamBudgets.map(({ committedCents, id, monthlyBudgetCents, team }) => (
			<li key={id}>
				<BudgetMetricCard committedCents={committedCents} monthlyBudgetCents={monthlyBudgetCents} team={team} />
			</li>
		))}
	</WorkspaceCardGrid>
);
