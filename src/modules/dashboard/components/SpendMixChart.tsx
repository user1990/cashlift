"use client";

import dynamic from "next/dynamic";
import { formatCurrencyDollars } from "@/modules/money/format";
import type { SpendChartDataPoint } from "../types";
import { ChartPlaceholder } from "./ChartPlaceholder";

type SpendMixChartContentProps = {
	chartData: SpendChartDataPoint[];
};

const SpendMixChartContent = dynamic<SpendMixChartContentProps>(
	async () => {
		const { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } = await import("recharts");

		return function SpendMixChartContent({ chartData }: SpendMixChartContentProps) {
			return (
				<ResponsiveContainer height={245} minWidth={0} width="100%">
					<BarChart barGap={12} barSize={44} data={chartData} margin={{ bottom: 0, left: 0, right: 0, top: 12 }}>
						<defs>
							<linearGradient id="budgetUsedFill" x1="0" x2="0" y1="0" y2="1">
								<stop offset="0%" stopColor="var(--primary)" />

								<stop offset="100%" stopColor="var(--primary-muted)" />
							</linearGradient>

							<linearGradient id="budgetRemainingFill" x1="0" x2="0" y1="0" y2="1">
								<stop offset="0%" stopColor="var(--highlight)" />

								<stop offset="100%" stopColor="var(--highlight-muted)" />
							</linearGradient>
						</defs>

						<CartesianGrid stroke="var(--border)" strokeOpacity={0.8} vertical={false} />

						<XAxis
							axisLine={false}
							dataKey="team"
							tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
							tickLine={false}
						/>

						<YAxis
							axisLine={false}
							tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
							tickFormatter={(value: number) => `$${Math.round(value / 1_000)}K`}
							tickLine={false}
							width={52}
						/>

						<Tooltip formatter={(value) => [`$${value}`, "Spend"]} />

						<Bar dataKey="used" fill="url(#budgetUsedFill)" name="Budget used" radius={[6, 6, 0, 0]} />

						<Bar dataKey="remaining" fill="url(#budgetRemainingFill)" name="Remaining" radius={[6, 6, 0, 0]} />
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
