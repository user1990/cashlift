import { formatCurrency } from "@/modules/money/format";
import type { FinancialDataset } from "@/modules/workspace/types";
import { getTeamBudgetRemaining } from "@/modules/workspace/utils";
import { WorkspaceCardGrid } from "./WorkspaceCardGrid";
import { WorkspaceMetricCard } from "./WorkspaceMetricCard";

type WorkspaceBudgetsSectionProps = {
	dataset: FinancialDataset;
};

export const WorkspaceBudgetsSection = ({ dataset }: WorkspaceBudgetsSectionProps) => (
	<WorkspaceCardGrid as="ul">
		{dataset.teamBudgets.map(({ committedCents, id, monthlyBudgetCents, team }) => (
			<li key={id}>
				<WorkspaceMetricCard
					as="article"
					description="remaining this month"
					label="Team"
					title={team}
					value={formatCurrency(getTeamBudgetRemaining({ committedCents, monthlyBudgetCents }))}
					valueClassName="font-mono text-4xl+ text-panel-foreground"
				/>
			</li>
		))}
	</WorkspaceCardGrid>
);
