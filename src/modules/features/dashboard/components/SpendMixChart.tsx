"use client";

import dynamic from "next/dynamic";
import { formatCurrencyDollars } from "@/modules/common/money/format";
import type { SpendChartDataPoint } from "../types";
import { ChartPlaceholder } from "./ChartPlaceholder";

type SpendMixChartContentProps = {
	chartData: SpendChartDataPoint[];
};

const SpendMixChartContent = dynamic<SpendMixChartContentProps>(
	async () => {
		const { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } = await import("recharts");

		return function SpendMixChartContent({ chartData }: SpendMixChartContentProps) {
			return (
				<ResponsiveContainer height={280} minWidth={0} width="100%">
					<BarChart data={chartData}>
						<CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />

						<XAxis
							axisLine={false}
							dataKey="team"
							tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
							tickLine={false}
						/>

						<Tooltip formatter={(value) => [`$${value}`, "Spend"]} />

						<Bar dataKey="committed" fill="var(--primary)" radius={[6, 6, 0, 0]} />

						<Bar dataKey="approved" fill="var(--highlight)" radius={[6, 6, 0, 0]} />
					</BarChart>
				</ResponsiveContainer>
			);
		};
	},
	{
		loading: () => <ChartPlaceholder />,
		ssr: false,
	},
);

type SpendMixChartProps = {
	chartData: SpendChartDataPoint[];
	chartsReady: boolean;
};

export const SpendMixChart = ({ chartData, chartsReady }: SpendMixChartProps) =>
	chartsReady ? (
		<>
			<SpendMixChartSummary chartData={chartData} />

			<SpendMixChartContent chartData={chartData} />
		</>
	) : (
		<ChartPlaceholder />
	);

const SpendMixChartSummary = ({ chartData }: SpendMixChartContentProps) => (
	<table className="sr-only">
		<caption>Committed and approved spend by team</caption>

		<thead>
			<tr>
				<th scope="col">Team</th>

				<th scope="col">Committed spend</th>

				<th scope="col">Approved spend</th>
			</tr>
		</thead>

		<tbody>
			{chartData.map(({ approved, committed, team }) => (
				<tr key={team}>
					<th scope="row">{team}</th>

					<td>{formatCurrencyDollars(committed)}</td>

					<td>{formatCurrencyDollars(approved)}</td>
				</tr>
			))}
		</tbody>
	</table>
);
