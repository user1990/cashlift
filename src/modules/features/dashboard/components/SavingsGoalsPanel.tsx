import type { FinancialDataset } from "@/modules/base/finance/types";
import {
	getGoalProgress,
	getSuggestedMonthlyContribution,
} from "@/modules/base/finance/utils";
import { formatCurrency } from "@/modules/common/money/format";
import { Panel, PanelHeader } from "@/modules/ui/components/Panel";
import { ProgressMeter } from "@/modules/ui/components/ProgressMeter";

type SavingsGoalsPanelProps = {
	dataset: FinancialDataset;
};

export const SavingsGoalsPanel = ({ dataset }: SavingsGoalsPanelProps) => (
	<Panel>
		<PanelHeader eyebrow="Goals" title="Savings pace" />

		<div className="space-y-4">
			{dataset.savingsGoals.map((goal) => (
				<div className="space-y-2" key={goal.id}>
					<ProgressMeter label={goal.label} value={getGoalProgress(goal)} />

					<div className="flex items-center justify-between gap-3 text-xs text-[#6B6B6B]">
						<span>{formatCurrency(goal.currentCents)} saved</span>

						<span>
							Suggest {formatCurrency(getSuggestedMonthlyContribution(goal))}
							/mo
						</span>
					</div>
				</div>
			))}
		</div>
	</Panel>
);
