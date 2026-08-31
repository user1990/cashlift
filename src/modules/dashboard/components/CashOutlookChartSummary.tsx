import { formatCurrency, formatCurrencyDollars } from "@/modules/money/format";
import type { MoneyCents } from "@/modules/money/types";
import { formatDashboardDate } from "../overviewDateRangeLabel";
import type { ForecastChartDataPoint } from "../types";

type CashOutlookChartSummaryProps = {
	bufferTargetCents: MoneyCents;
	chartData: ForecastChartDataPoint[];
	lowestProjectedCashDate?: string;
};

export const CashOutlookChartSummary = ({
	bufferTargetCents,
	chartData,
	lowestProjectedCashDate,
}: CashOutlookChartSummaryProps) => (
	<table className="sr-only">
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
				<tr key={rowKey}>
					<th scope="row">{week.slice(5)}</th>

					<td>{formatCurrencyDollars(balance)}</td>

					<td>{formatCurrencyDollars(inflow)}</td>

					<td>{formatCurrencyDollars(outflow)}</td>
				</tr>
			))}
		</tbody>
	</table>
);
