import type { SpendChartDataPoint } from "../types";
import { SpendMixChartContent } from "./SpendMixChartContent";
import { SpendMixChartSummary } from "./SpendMixChartSummary";

type SpendMixChartProps = {
	chartData: SpendChartDataPoint[];
};

export const SpendMixChart = ({ chartData }: SpendMixChartProps) =>
	chartData.length ? (
		<>
			<SpendMixChartSummary chartData={chartData} />

			<SpendMixChartContent chartData={chartData} />
		</>
	) : (
		<p className="text-m text-muted-foreground">No team budgets for this range.</p>
	);
