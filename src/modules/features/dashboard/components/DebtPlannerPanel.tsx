import type { FinancialDataset } from "@/modules/base/finance/types";
import { formatCurrency, percentage } from "@/modules/common/money/format";
import { Panel, PanelHeader } from "@/modules/ui/components/Panel";
import { SegmentedControl } from "@/modules/ui/components/SegmentedControl";
import { debtStrategyOptions } from "../constants";
import type { DebtStrategy } from "../types";

type DebtPlannerPanelProps = {
	debts: FinancialDataset["debts"];
	onStrategyChange: (strategy: DebtStrategy) => void;
	strategy: DebtStrategy;
};

export const DebtPlannerPanel = ({
	debts,
	onStrategyChange,
	strategy,
}: DebtPlannerPanelProps) => (
	<Panel>
		<PanelHeader
			action={
				<SegmentedControl
					label="Debt payoff strategy"
					onChange={onStrategyChange}
					options={debtStrategyOptions}
					value={strategy}
				/>
			}
			eyebrow="Debt"
			title="Payoff order"
		/>

		<div className="space-y-3">
			{debts.map((debt, index) => (
				<div
					className="rounded-lg border border-[#E8E8EC] bg-[#FAFAFA] p-3"
					key={debt.id}
				>
					<div className="flex items-center justify-between gap-3">
						<p className="text-sm font-semibold text-[#0A0A0A]">
							{index + 1}. {debt.label}
						</p>

						<span className="font-mono text-sm">
							{formatCurrency(debt.balanceCents)}
						</span>
					</div>

					<p className="mt-1 text-xs text-[#6B6B6B]">
						{percentage(debt.interestRate)} APR · minimum{" "}
						{formatCurrency(debt.minimumPaymentCents)}
					</p>
				</div>
			))}
		</div>
	</Panel>
);
