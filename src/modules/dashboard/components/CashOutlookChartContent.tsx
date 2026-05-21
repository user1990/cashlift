import { domAnimation, LazyMotion } from "motion/react";
import * as m from "motion/react-m";
import { formatCurrencyDollars } from "@/modules/money/format";
import type { ForecastChartDataPoint } from "../types";
import {
	RechartsArea,
	RechartsAreaChart,
	RechartsCartesianGrid,
	RechartsResponsiveContainer,
	RechartsTooltip,
	RechartsXAxis,
	RechartsYAxis,
} from "./LazyRechartsComponent";

type CashOutlookChartContentProps = {
	chartData: ForecastChartDataPoint[];
};

export const CashOutlookChartContent = ({ chartData }: CashOutlookChartContentProps) => {
	const balances = chartData.map(({ balance }) => balance);
	const minimumBalance = Math.min(...balances);
	const maximumBalance = Math.max(...balances);

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
					<RechartsAreaChart data={chartData}>
						<defs>
							<linearGradient id="cashOutlookFill" x1="0" x2="0" y1="0" y2="1">
								<stop offset="0%" stopColor="var(--primary)" stopOpacity="0.45" />

								<stop offset="100%" stopColor="var(--primary)" stopOpacity="0.02" />
							</linearGradient>
						</defs>

						<RechartsCartesianGrid />

						<RechartsXAxis dataKey="week" tickFormatter={formatWeekLabel} />

						<RechartsYAxis domain={[minimumBalance, maximumBalance]} tickFormatter={formatMillions} />

						<RechartsTooltip formatter={formatTooltipCurrency} labelFormatter={formatWeekLabel} />

						<RechartsArea
							animationDuration={700}
							dataKey="balance"
							dot={{ fill: "var(--primary)", r: 4, stroke: "var(--shell)", strokeWidth: 2 }}
							fill="url(#cashOutlookFill)"
							name="Projected balance"
							stroke="var(--primary)"
							strokeWidth={3}
							type="monotone"
						/>
					</RechartsAreaChart>
				</RechartsResponsiveContainer>
			</m.div>
		</LazyMotion>
	);
};

function formatMillions(value: number) {
	return `$${(value / 1_000_000).toFixed(1)}M`;
}

function formatTooltipCurrency(value: unknown) {
	return formatCurrencyDollars(Number(value));
}

function formatWeekLabel(week: unknown) {
	return String(week).slice(5);
}
