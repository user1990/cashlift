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
					<RechartsCartesianGrid />

					<RechartsXAxis dataKey="team" />

					<RechartsYAxis domain={[minimumValue, maximumValue]} tickFormatter={formatThousands} />

					<RechartsTooltip formatter={formatTooltipCurrency} />

					<RechartsBar animationDuration={650} dataKey="used" fill="var(--primary)" name="Budget used" />

					<RechartsBar
						animationDuration={650}
						dataKey="remaining"
						fill="var(--shell-muted)"
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
