import { formatPreciseCompactCurrency } from "@/modules/money/format";
import { Panel, PanelHeader } from "@/ui/components/Panel";
import { Reveal } from "@/ui/components/Reveal";
import type { DashboardViewModel } from "../types";
import { CashOutlookChart } from "./CashOutlookChart";
import { SpendMixChart } from "./SpendMixChart";

type DashboardChartsSectionProps = {
	chartsReady: boolean;
	dashboard: DashboardViewModel;
};

export const DashboardChartsSection = ({ chartsReady, dashboard }: DashboardChartsSectionProps) => (
	<Reveal className="grid gap-4 xl:grid-cols-[0.98fr_1.03fr]" delay={0.08} duration={0.16} y={8}>
		<Panel className="min-h-[365px] p-6">
			<PanelHeader
				action={
					<div className="text-right">
						<p className="font-mono text-3xl+ text-panel-foreground">
							{formatPreciseCompactCurrency(dashboard.endingCashBalanceCents)}
						</p>

						<p className="text-s text-muted-foreground">Ending cash balance</p>
					</div>
				}
				eyebrow="13-week cash outlook"
				title="Cash outlook from accounting-style data"
			/>

			<CashOutlookChart chartData={dashboard.forecastChartData} chartsReady={chartsReady} />
		</Panel>

		<Panel className="min-h-[365px] p-6">
			<PanelHeader action={<BudgetLegend />} eyebrow="Team budgets" title="Committed spend by team" />

			<SpendMixChart chartData={dashboard.spendChartData} chartsReady={chartsReady} />
		</Panel>
	</Reveal>
);

const BudgetLegend = () => (
	<div className="flex flex-wrap items-center gap-4 text-s+ text-shell-muted">
		<span className="inline-flex items-center gap-2">
			<span className="size-3 rounded-full bg-primary" />
			Budget used
		</span>

		<span className="inline-flex items-center gap-2">
			<span className="size-3 rounded-full bg-highlight" />
			Remaining
		</span>
	</div>
);
