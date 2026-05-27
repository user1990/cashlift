import type { SpendChartDataPoint } from "../types";
import { SpendMixChartContent } from "./SpendMixChartContent";
import { SpendMixChartSummary } from "./SpendMixChartSummary";

type SpendMixChartProps = {
	chartData: SpendChartDataPoint[];
};

export const SpendMixChart = ({ chartData }: SpendMixChartProps) => (
	<>
		<SpendMixChartSummary chartData={chartData} />

		<SpendMixChartContent chartData={chartData} />
	</>
);
