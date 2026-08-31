import { formatPreciseCompactCurrency } from "@/modules/money/format";
import { formatDashboardDate } from "../overviewDateRangeLabel";
import type { DashboardViewModel } from "../types";
import { BudgetLegend } from "./BudgetLegend";
import { CashOutlookChart } from "./CashOutlookChart";
import { DashboardPanel } from "./DashboardPanel";
import { SpendMixChart } from "./SpendMixChart";

type ChartsSectionProps = {
	dashboard: DashboardViewModel;
};

export const ChartsSection = ({ dashboard }: ChartsSectionProps) => {
	const lowestProjectedCashCents = dashboard.lowestProjectedCashCents;
	const lowestProjectedCashDate = dashboard.lowestProjectedCashDate;
	const outlookTitle =
		lowestProjectedCashDate && lowestProjectedCashCents !== undefined
			? `Lowest week ${formatPreciseCompactCurrency(lowestProjectedCashCents)} on ${formatDashboardDate(lowestProjectedCashDate)}`
			: "No 13-week outlook for this range";

	return (
		<div className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(0,0.85fr)]">
			<DashboardPanel
				action={
					lowestProjectedCashCents !== undefined && (
						<div className="text-right">
							<p className="font-mono text-3xl+ text-panel-foreground">
								{formatPreciseCompactCurrency(lowestProjectedCashCents)}
							</p>

							<p className="text-muted-foreground text-s">Lowest projected cash</p>
						</div>
					)
				}
				label="13-week cash outlook"
				title={outlookTitle}
			>
				<CashOutlookChart
					bufferTargetCents={dashboard.cashBufferTargetCents}
					chartData={dashboard.forecastChartData}
					lowestProjectedCashDate={lowestProjectedCashDate}
				/>
			</DashboardPanel>

			<DashboardPanel
				action={dashboard.spendChartData.length > 0 && <BudgetLegend />}
				label="Team budgets"
				title="Supporting spend mix"
			>
				<SpendMixChart chartData={dashboard.spendChartData} />
			</DashboardPanel>
		</div>
	);
};
