import { formatCurrency } from "@/modules/money/format";
import type { FinancialDataset } from "@/modules/workspace/types";
import { getTeamBudgetRemaining } from "@/modules/workspace/utils";
import { Panel, PanelHeader } from "@/ui/components/Panel";

type WorkspaceBudgetsSectionProps = {
	dataset: FinancialDataset;
};

export const WorkspaceBudgetsSection = ({ dataset }: WorkspaceBudgetsSectionProps) => (
	<ul className="grid gap-4 md:grid-cols-3">
		{dataset.teamBudgets.map(({ committedCents, id, monthlyBudgetCents, team }) => (
			<li key={id}>
				<Panel as="article">
					<PanelHeader eyebrow="Team" title={team} />

					<dl>
						<dt className="sr-only">Remaining this month</dt>

						<dd className="font-mono text-4xl+ text-panel-foreground">
							{formatCurrency(getTeamBudgetRemaining({ committedCents, monthlyBudgetCents }))}
						</dd>
					</dl>

					<p className="mt-2 text-m text-muted-foreground">remaining this month</p>
				</Panel>
			</li>
		))}
	</ul>
);
