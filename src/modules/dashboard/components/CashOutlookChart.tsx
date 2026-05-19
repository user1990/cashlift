import { domAnimation, LazyMotion } from "motion/react";
import * as m from "motion/react-m";
import dynamic from "next/dynamic";
import { formatCurrencyDollars } from "@/modules/money/format";
import type { ForecastChartDataPoint } from "../types";
import { ChartPlaceholder } from "./ChartPlaceholder";

const CHART_HEIGHT = 245;
const TICK_COUNT = 4;

const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false });
const AreaChart = dynamic(() => import("recharts").then((mod) => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import("recharts").then((mod) => mod.Area), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then((mod) => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), { ssr: false });

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

type CashOutlookChartContentProps = {
	chartData: ForecastChartDataPoint[];
};

const CashOutlookChartContent = ({ chartData }: CashOutlookChartContentProps) => {
	const balances = chartData.map(({ balance }) => balance);
	const minimumBalance = Math.min(...balances);
	const maximumBalance = Math.max(...balances);

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
					<AreaChart data={chartData} margin={{ bottom: 0, left: 4, right: 8, top: 12 }}>
						<defs>
							<linearGradient id="cashOutlookFill" x1="0" x2="0" y1="0" y2="1">
								<stop offset="0%" stopColor="var(--primary)" stopOpacity="0.45" />

								<stop offset="100%" stopColor="var(--primary)" stopOpacity="0.02" />
							</linearGradient>
						</defs>

						<CartesianGrid stroke="var(--border)" strokeOpacity={0.8} vertical={false} />

						<XAxis
							axisLine={false}
							dataKey="week"
							tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
							tickFormatter={formatWeekLabel}
							tickLine={false}
						/>

						<YAxis
							axisLine={false}
							domain={[minimumBalance, maximumBalance]}
							tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
							tickCount={TICK_COUNT}
							tickFormatter={formatMillions}
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
							labelFormatter={formatWeekLabel}
						/>

						<Area
							animationDuration={700}
							dataKey="balance"
							dot={{ fill: "var(--primary)", r: 4, stroke: "var(--shell)", strokeWidth: 2 }}
							fill="url(#cashOutlookFill)"
							isAnimationActive
							name="Projected balance"
							stroke="var(--primary)"
							strokeWidth={3}
							type="monotone"
						/>
					</AreaChart>
				</ResponsiveContainer>
			</m.div>
		</LazyMotion>
	);
};

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

function formatMillions(value: number) {
	return `$${(value / 1_000_000).toFixed(1)}M`;
}

function formatTooltipCurrency(value: unknown) {
	return formatCurrencyDollars(Number(value));
}

function formatWeekLabel(week: unknown) {
	return String(week).slice(5);
}
