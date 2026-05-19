import { formatCurrency } from "@/modules/money/format";
import type { FinancialDataset } from "@/modules/workspace/types";
import { Panel, PanelHeader } from "@/ui/components/Panel";

type WorkspaceCashSectionProps = {
	dataset: FinancialDataset;
};

export const WorkspaceCashSection = ({ dataset }: WorkspaceCashSectionProps) => (
	<div className="grid gap-4 md:grid-cols-3">
		<Panel>
			<PanelHeader label="Cash" title="Available balance" />

			<dl>
				<dt className="sr-only">Available balance</dt>

				<dd className="font-mono text-5xl+ text-panel-foreground">
					{formatCurrency(dataset.profile.cashBalanceCents)}
				</dd>
			</dl>
		</Panel>

		<Panel>
			<PanelHeader label="Buffer" title="Target reserve" />

			<dl>
				<dt className="sr-only">Target reserve</dt>

				<dd className="font-mono text-5xl+ text-panel-foreground">
					{formatCurrency(dataset.profile.cashBufferTargetCents)}
				</dd>
			</dl>
		</Panel>

		<Panel>
			<PanelHeader label="Payroll" title="Monthly payroll" />

			<dl>
				<dt className="sr-only">Monthly payroll</dt>

				<dd className="font-mono text-5xl+ text-panel-foreground">
					{formatCurrency(dataset.profile.monthlyPayrollCents)}
				</dd>
			</dl>
		</Panel>
	</div>
);
