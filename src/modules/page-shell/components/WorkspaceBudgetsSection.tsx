import { TeamBudgetsDashboard } from "@/modules/dashboard/cockpits/TeamBudgetsDashboard";
import type { FinancialDataset } from "@/modules/workspace/types";

type WorkspaceBudgetsSectionProps = {
	dataset: FinancialDataset;
};

export const WorkspaceBudgetsSection = ({ dataset }: WorkspaceBudgetsSectionProps) => (
	<TeamBudgetsDashboard dataset={dataset} />
);
