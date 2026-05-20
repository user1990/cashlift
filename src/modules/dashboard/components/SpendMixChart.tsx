import { domAnimation, LazyMotion } from "motion/react";
import * as m from "motion/react-m";
import { formatCurrencyDollars } from "@/modules/money/format";
import type { SpendChartDataPoint } from "../types";
import { ChartPlaceholder } from "./ChartPlaceholder";
import {
	RechartsBar,
	RechartsBarChart,
	RechartsCartesianGrid,
	RechartsResponsiveContainer,
	RechartsTooltip,
	RechartsXAxis,
	RechartsYAxis,
} from "./LazyRechartsComponent";

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

type SpendMixChartContentProps = {
	chartData: SpendChartDataPoint[];
};

const SpendMixChartContent = ({ chartData }: SpendMixChartContentProps) => {
	const maximumValue = Math.max(...chartData.flatMap(({ remaining, used }) => [remaining, used]), 1);

	return (
		<LazyMotion features={domAnimation}>
			<m.div
				animate={{ opacity: 1, y: 0 }}
				aria-hidden="true"
				className="h-60 w-full"
				initial={{ opacity: 0, y: 8 }}
				transition={{ duration: 0.35, ease: "easeOut" }}
			>
				<RechartsResponsiveContainer>
					<RechartsBarChart data={chartData}>
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

						<RechartsCartesianGrid />

						<RechartsXAxis dataKey="team" />

						<RechartsYAxis domain={[0, maximumValue]} tickFormatter={formatThousands} />

						<RechartsTooltip formatter={formatTooltipCurrency} />

						<RechartsBar animationDuration={650} dataKey="used" fill="url(#budgetUsedFill)" name="Budget used" />

						<RechartsBar
							animationDuration={650}
							dataKey="remaining"
							fill="url(#budgetRemainingFill)"
							name="Remaining budget"
						/>
					</RechartsBarChart>
				</RechartsResponsiveContainer>
			</m.div>
		</LazyMotion>
	);
};

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

function formatThousands(value: number) {
	return `$${Math.round(value / 1_000)}K`;
}

function formatTooltipCurrency(value: unknown) {
	return formatCurrencyDollars(Number(value));
}
