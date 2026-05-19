import { domAnimation, LazyMotion } from "motion/react";
import * as m from "motion/react-m";
import dynamic from "next/dynamic";
import { formatCurrencyDollars } from "@/modules/money/format";
import type { SpendChartDataPoint } from "../types";
import { ChartPlaceholder } from "./ChartPlaceholder";

const CHART_HEIGHT = 245;
const TICK_COUNT = 4;

const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false });
const BarChart = dynamic(() => import("recharts").then((mod) => mod.BarChart), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then((mod) => mod.CartesianGrid), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), { ssr: false });
const Bar = dynamic(() => import("recharts").then((mod) => mod.Bar), { ssr: false });

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
				className="h-[245px] w-full"
				initial={{ opacity: 0, y: 8 }}
				transition={{ duration: 0.35, ease: "easeOut" }}
			>
				<ResponsiveContainer height={CHART_HEIGHT} width="100%">
					<BarChart data={chartData} margin={{ bottom: 0, left: 4, right: 8, top: 12 }}>
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
							domain={[0, maximumValue]}
							tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
							tickCount={TICK_COUNT}
							tickFormatter={formatThousands}
							tickLine={false}
							width={48}
						/>

						<Tooltip
							contentStyle={{
								background: "var(--panel)",
								border: "1px solid var(--border)",
								borderRadius: 8,
								color: "var(--panel-foreground)",
							}}
							formatter={formatTooltipCurrency}
						/>

						<Bar
							animationDuration={650}
							dataKey="used"
							fill="url(#budgetUsedFill)"
							isAnimationActive
							name="Budget used"
							radius={[6, 6, 0, 0]}
						/>

						<Bar
							animationDuration={650}
							dataKey="remaining"
							fill="url(#budgetRemainingFill)"
							isAnimationActive
							name="Remaining budget"
							radius={[6, 6, 0, 0]}
						/>
					</BarChart>
				</ResponsiveContainer>
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
