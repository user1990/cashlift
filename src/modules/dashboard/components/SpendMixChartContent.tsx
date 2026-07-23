import { formatCurrencyDollars } from "@/modules/money/format";
import type { SpendChartDataPoint } from "../types";
import { ChartFrame } from "./ChartFrame";
import {
	RechartsBar,
	RechartsBarChart,
	RechartsCartesianGrid,
	RechartsResponsiveContainer,
	RechartsTooltip,
	RechartsXAxis,
	RechartsYAxis,
} from "./LazyRechartsComponent";

type SpendMixChartContentProps = {
	chartData: SpendChartDataPoint[];
};

export const SpendMixChartContent = ({ chartData }: SpendMixChartContentProps) => {
	const minimumValue = Math.min(...chartData.map(({ remaining }) => remaining), 0);
	const maximumValue = Math.max(...chartData.flatMap(({ remaining, used }) => [remaining, used]), 1);

	return (
		<ChartFrame>
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

					<RechartsYAxis domain={[minimumValue, maximumValue]} tickFormatter={formatThousands} />

					<RechartsTooltip formatter={formatTooltipCurrency} />

					<RechartsBar animationDuration={650} dataKey="used" fill="url(#budgetUsedFill)" name="Budget used" />

					<RechartsBar
						animationDuration={650}
						dataKey="remaining"
						fill="url(#budgetRemainingFill)"
						name="Remaining budget (negative = over budget)"
					/>
				</RechartsBarChart>
			</RechartsResponsiveContainer>
		</ChartFrame>
	);
};

function formatThousands(value: number) {
	return `$${Math.round(value / 1_000)}K`;
}

function formatTooltipCurrency(value: unknown) {
	return formatCurrencyDollars(Number(value));
}
