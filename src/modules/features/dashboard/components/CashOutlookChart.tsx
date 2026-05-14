"use client";

import dynamic from "next/dynamic";
import { formatCurrencyDollars } from "@/modules/common/money/format";
import type { ForecastChartDataPoint } from "../types";
import { ChartPlaceholder } from "./ChartPlaceholder";

type CashOutlookChartContentProps = {
	chartData: ForecastChartDataPoint[];
};

const CashOutlookChartContent = dynamic<CashOutlookChartContentProps>(
	async () => {
		const { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } = await import("recharts");

		return function CashOutlookChartContent({ chartData }: CashOutlookChartContentProps) {
			return (
				<ResponsiveContainer height={280} minWidth={0} width="100%">
					<AreaChart data={chartData}>
						<CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />

						<XAxis
							axisLine={false}
							dataKey="week"
							tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
							tickFormatter={(value: string) => value.slice(5)}
							tickLine={false}
						/>

						<Tooltip formatter={(value) => [`$${value}`, "Projected"]} />

						<Area
							dataKey="balance"
							fill="var(--primary-subtle)"
							stroke="var(--primary)"
							strokeWidth={2}
							type="monotone"
						/>
					</AreaChart>
				</ResponsiveContainer>
			);
		};
	},
	{
		loading: () => <ChartPlaceholder />,
		ssr: false,
	},
);

type CashOutlookChartProps = {
	chartData: ForecastChartDataPoint[];
	chartsReady: boolean;
};

export const CashOutlookChart = ({ chartData, chartsReady }: CashOutlookChartProps) =>
	chartsReady ? (
		<>
			<CashOutlookChartSummary chartData={chartData} />

			<CashOutlookChartContent chartData={chartData} />
		</>
	) : (
		<ChartPlaceholder />
	);

const CashOutlookChartSummary = ({ chartData }: CashOutlookChartContentProps) => (
	<table className="sr-only">
		<caption>13-week cash outlook by week</caption>

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
