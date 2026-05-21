import { formatPreciseCompactCurrency } from "@/modules/money/format";
import type { DashboardViewModel } from "../types";
import { BudgetLegend } from "./BudgetLegend";
import { CashOutlookChart } from "./CashOutlookChart";
import { DashboardPanel } from "./DashboardPanel";
import { SpendMixChart } from "./SpendMixChart";

type DashboardChartsSectionProps = {
	chartsReady: boolean;
	dashboard: DashboardViewModel;
};

export const DashboardChartsSection = ({ chartsReady, dashboard }: DashboardChartsSectionProps) => (
	<div className="grid gap-4 xl:grid-cols-[0.98fr_1.03fr]">
		<DashboardPanel
			action={
				<div className="text-right">
					<p className="font-mono text-3xl+ text-panel-foreground">
						{formatPreciseCompactCurrency(dashboard.endingCashBalanceCents)}
					</p>

					<p className="text-s text-muted-foreground">Ending cash balance</p>
				</div>
			}
			label="13-week cash outlook"
			title="Cash outlook from accounting-style data"
		>
			<CashOutlookChart chartData={dashboard.forecastChartData} chartsReady={chartsReady} />
		</DashboardPanel>

		<DashboardPanel action={<BudgetLegend />} label="Team budgets" title="Committed spend by team">
			<SpendMixChart chartData={dashboard.spendChartData} chartsReady={chartsReady} />
		</DashboardPanel>
	</div>
);
