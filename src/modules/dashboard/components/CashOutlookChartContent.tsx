import { useId } from "react";
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { centsToDollars, formatCurrencyDollars, formatPreciseCompactCurrency } from "@/modules/money/format";
import type { MoneyCents } from "@/modules/money/types";
import type { ForecastChartDataPoint } from "../types";
import { ChartFrame } from "./ChartFrame";

type CashOutlookChartContentProps = {
	bufferTargetCents: MoneyCents;
	chartData: ForecastChartDataPoint[];
	lowestProjectedCashDate?: string;
};

const DEFAULT_AXIS_TICK = { fill: "var(--muted-foreground)", fontSize: 12 } as const;

export const CashOutlookChartContent = ({
	bufferTargetCents,
	chartData,
	lowestProjectedCashDate,
}: CashOutlookChartContentProps) => {
	const chartId = useId().replaceAll(":", "");
	const cashOutlookFillId = `cash-outlook-fill-${chartId}`;

	if (!chartData.length) {
		return <p className="text-m text-muted-foreground">No 13-week outlook for this range.</p>;
	}

	const balances = chartData.map(({ balance }) => balance);
	const minimumBalance = Math.min(...balances);
	const maximumBalance = Math.max(...balances);
	const bufferDollars = centsToDollars(bufferTargetCents);
	const showBufferLine = shouldShowBufferLine(bufferDollars, minimumBalance, maximumBalance);
	const domainMin = showBufferLine ? Math.min(minimumBalance, bufferDollars) : minimumBalance;

	return (
		<ChartFrame>
			<ResponsiveContainer
				height="100%"
				initialDimension={{ height: 240, width: 1 }}
				minHeight={0}
				minWidth={0}
				width="100%"
			>
				<AreaChart data={chartData} margin={{ bottom: 0, left: 4, right: 8, top: 12 }}>
					<defs>
						<linearGradient id={cashOutlookFillId} x1="0" x2="0" y1="0" y2="1">
							<stop offset="0%" stopColor="var(--primary)" stopOpacity="0.22" />

							<stop offset="100%" stopColor="var(--primary)" stopOpacity="0.02" />
						</linearGradient>
					</defs>

					<CartesianGrid stroke="var(--border)" strokeOpacity={0.8} vertical={false} />

					<XAxis
						axisLine={false}
						dataKey="week"
						tick={DEFAULT_AXIS_TICK}
						tickFormatter={formatWeekLabel}
						tickLine={false}
					/>

					<YAxis
						axisLine={false}
						domain={[domainMin, maximumBalance]}
						tick={DEFAULT_AXIS_TICK}
						tickCount={4}
						tickFormatter={formatOutlookAxis}
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

					{showBufferLine && (
						<ReferenceLine
							label={{ fill: "var(--muted-foreground)", fontSize: 12, position: "insideTopLeft", value: "Buffer" }}
							y={bufferDollars}
						/>
					)}

					<Area
						isAnimationActive={false}
						dataKey="balance"
						dot={getOutlookDot(lowestProjectedCashDate)}
						fill={`url(#${cashOutlookFillId})`}
						name="Projected balance"
						stroke="var(--primary)"
						strokeWidth={2}
						type="monotone"
					/>
				</AreaChart>
			</ResponsiveContainer>
		</ChartFrame>
	);
};

export default CashOutlookChartContent;

function shouldShowBufferLine(bufferDollars: number, minimumBalance: number, maximumBalance: number) {
	if (bufferDollars <= 0 || bufferDollars > maximumBalance) {
		return false;
	}

	return bufferDollars >= minimumBalance * 0.5;
}

function getOutlookDot(lowestProjectedCashDate: string | undefined) {
	return ({ cx, cy, payload }: { cx?: number; cy?: number; payload?: { week?: string } }) => {
		const isTrough = Boolean(lowestProjectedCashDate) && payload?.week === lowestProjectedCashDate;

		return (
			<circle
				cx={cx}
				cy={cy}
				fill={isTrough ? "var(--warning)" : "var(--primary)"}
				r={isTrough ? 5 : 3}
				stroke="var(--shell)"
				strokeWidth={2}
			/>
		);
	};
}

function formatOutlookAxis(value: number) {
	return formatPreciseCompactCurrency(Math.round(value * 100));
}

function formatTooltipCurrency(value: unknown) {
	return formatCurrencyDollars(Number(value));
}

function formatWeekLabel(week: unknown) {
	return String(week).slice(5);
}
