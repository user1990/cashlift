import { formatCurrency } from "@/modules/money/format";
import type { FinancialDataset } from "@/modules/workspace/types";
import { WorkspaceCardGrid } from "./WorkspaceCardGrid";
import { WorkspaceMetricCard } from "./WorkspaceMetricCard";

type WorkspaceCashSectionProps = {
	dataset: FinancialDataset;
};

export const WorkspaceCashSection = ({ dataset }: WorkspaceCashSectionProps) => (
	<WorkspaceCardGrid>
		<WorkspaceMetricCard
			label="Cash"
			title="Available balance"
			value={formatCurrency(dataset.profile.cashBalanceCents)}
		/>

		<WorkspaceMetricCard
			label="Buffer"
			title="Target reserve"
			value={formatCurrency(dataset.profile.cashBufferTargetCents)}
		/>

		<WorkspaceMetricCard
			label="Payroll"
			title="Monthly payroll"
			value={formatCurrency(dataset.profile.monthlyPayrollCents)}
		/>
	</WorkspaceCardGrid>
);
