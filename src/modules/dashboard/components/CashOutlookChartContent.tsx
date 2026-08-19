import { useId } from "react";
import { centsToDollars, formatCurrencyDollars } from "@/modules/money/format";
import type { MoneyCents } from "@/modules/money/types";
import type { ForecastChartDataPoint } from "../types";
import { ChartFrame } from "./ChartFrame";
import {
	RechartsArea,
	RechartsAreaChart,
	RechartsCartesianGrid,
	RechartsReferenceLine,
	RechartsResponsiveContainer,
	RechartsTooltip,
	RechartsXAxis,
	RechartsYAxis,
} from "./LazyRechartsComponent";

type CashOutlookChartContentProps = {
	bufferTargetCents: MoneyCents;
	chartData: ForecastChartDataPoint[];
	lowestProjectedCashDate?: string;
};

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
			<RechartsResponsiveContainer>
				<RechartsAreaChart data={chartData}>
					<defs>
						<linearGradient id={cashOutlookFillId} x1="0" x2="0" y1="0" y2="1">
							<stop offset="0%" stopColor="var(--primary)" stopOpacity="0.22" />

							<stop offset="100%" stopColor="var(--primary)" stopOpacity="0.02" />
						</linearGradient>
					</defs>

					<RechartsCartesianGrid />

					<RechartsXAxis dataKey="week" tickFormatter={formatWeekLabel} />

					<RechartsYAxis domain={[domainMin, maximumBalance]} tickFormatter={formatMillions} />

					<RechartsTooltip formatter={formatTooltipCurrency} labelFormatter={formatWeekLabel} />

					{showBufferLine && (
						<RechartsReferenceLine
							label={{ fill: "var(--muted-foreground)", fontSize: 12, position: "insideTopLeft", value: "Buffer" }}
							y={bufferDollars}
						/>
					)}

					<RechartsArea
						animationDuration={700}
						dataKey="balance"
						dot={getOutlookDot(lowestProjectedCashDate)}
						fill={`url(#${cashOutlookFillId})`}
						name="Projected balance"
						stroke="var(--primary)"
						strokeWidth={2}
						type="monotone"
					/>
				</RechartsAreaChart>
			</RechartsResponsiveContainer>
		</ChartFrame>
	);
};

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

function formatMillions(value: number) {
	return `$${(value / 1_000_000).toFixed(1)}M`;
}

function formatTooltipCurrency(value: unknown) {
	return formatCurrencyDollars(Number(value));
}

function formatWeekLabel(week: unknown) {
	return String(week).slice(5);
}
