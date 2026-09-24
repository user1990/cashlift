import { formatCurrency, formatCurrencyDollars } from "@/modules/money/format";
import type { MoneyCents } from "@/modules/money/types";
import { formatDashboardDate } from "../overviewDateRangeLabel";
import type { ForecastChartDataPoint } from "../types";

type CashOutlookChartSummaryProps = {
	bufferTargetCents: MoneyCents;
	chartData: ForecastChartDataPoint[];
	lowestProjectedCashDate?: string;
	className?: string;
};

export const CashOutlookChartSummary = ({
	bufferTargetCents,
	chartData,
	className = "sr-only",
	lowestProjectedCashDate,
}: CashOutlookChartSummaryProps) => (
	<table className={className}>
		<caption>
			13-week cash outlook by week. Cash buffer {formatCurrency(bufferTargetCents)}
			{lowestProjectedCashDate ? `. Lowest week ${formatDashboardDate(lowestProjectedCashDate)}` : ""}
		</caption>

		<thead>
			<tr>
				<th scope="col">Week</th>

				<th scope="col">Projected balance</th>

				<th scope="col">Inflow</th>

				<th scope="col">Outflow</th>
			</tr>
		</thead>

		<tbody>
			{chartData.map(({ balance, inflow, outflow, rowKey, week }) => (
				<tr key={rowKey} className="border-white/10 border-t">
					<th className="py-2 pr-4 text-left font-medium text-panel-foreground" scope="row">
						{week.slice(5)}
					</th>

					<td className="py-2 pr-4 font-mono tabular-nums">{formatCurrencyDollars(balance)}</td>

					<td className="py-2 pr-4 font-mono tabular-nums">{formatCurrencyDollars(inflow)}</td>

					<td className="py-2 font-mono tabular-nums">{formatCurrencyDollars(outflow)}</td>
				</tr>
			))}
		</tbody>
	</table>
);
