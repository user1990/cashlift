import { formatCurrencyDollars } from "@/modules/money/format";
import type { SpendChartDataPoint } from "../types";

type SpendMixChartSummaryProps = {
	chartData: SpendChartDataPoint[];
};

export const SpendMixChartSummary = ({ chartData }: SpendMixChartSummaryProps) => (
	<table className="sr-only">
		<caption>Budget used and remaining by team</caption>

		<thead>
			<tr>
				<th scope="col">Team</th>

				<th scope="col">Budget used</th>

				<th scope="col">Remaining budget</th>
			</tr>
		</thead>

		<tbody>
			{chartData.map(({ remaining, team, used }) => (
				<tr key={team}>
					<th scope="row">{team}</th>

					<td>{formatCurrencyDollars(used)}</td>

					<td>{formatCurrencyDollars(remaining)}</td>
				</tr>
			))}
		</tbody>
	</table>
);
