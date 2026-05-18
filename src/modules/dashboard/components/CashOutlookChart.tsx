"use client";

import dynamic from "next/dynamic";
import { formatCurrencyDollars } from "@/modules/money/format";
import type { ForecastChartDataPoint } from "../types";
import { ChartPlaceholder } from "./ChartPlaceholder";

type CashOutlookChartContentProps = {
	chartData: ForecastChartDataPoint[];
};

const CashOutlookChartContent = dynamic<CashOutlookChartContentProps>(
	async () => {
		const { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } = await import("recharts");

		return function CashOutlookChartContent({ chartData }: CashOutlookChartContentProps) {
			return (
				<ResponsiveContainer height={245} minWidth={0} width="100%">
					<AreaChart data={chartData} margin={{ bottom: 0, left: 0, right: 8, top: 12 }}>
						<defs>
							<linearGradient id="cashOutlookFill" x1="0" x2="0" y1="0" y2="1">
								<stop offset="0%" stopColor="var(--primary)" stopOpacity={0.45} />

								<stop offset="100%" stopColor="var(--primary)" stopOpacity={0.02} />
							</linearGradient>
						</defs>

						<CartesianGrid stroke="var(--border)" strokeOpacity={0.8} vertical={false} />

						<XAxis
							axisLine={false}
							dataKey="week"
							tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
							tickFormatter={(value: string) => value.slice(5)}
							tickLine={false}
						/>

						<YAxis
							axisLine={false}
							tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
							tickFormatter={(value: number) => `$${(value / 1_000_000).toFixed(1)}M`}
							tickLine={false}
							width={52}
						/>

						<Tooltip formatter={(value) => [`$${value}`, "Projected"]} />

						<Area
							dataKey="balance"
							dot={{ fill: "var(--primary)", r: 4, stroke: "var(--shell)", strokeWidth: 2 }}
							fill="url(#cashOutlookFill)"
							fillOpacity={1}
							stroke="var(--primary)"
							strokeWidth={3}
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
