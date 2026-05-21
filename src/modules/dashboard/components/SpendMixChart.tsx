import type { SpendChartDataPoint } from "../types";
import { ChartPlaceholder } from "./ChartPlaceholder";
import { SpendMixChartContent } from "./SpendMixChartContent";
import { SpendMixChartSummary } from "./SpendMixChartSummary";

type SpendMixChartProps = {
	chartData: SpendChartDataPoint[];
	chartsReady?: boolean;
};

export const SpendMixChart = ({ chartData, chartsReady = false }: SpendMixChartProps) =>
	chartsReady ? (
		<>
			<SpendMixChartSummary chartData={chartData} />

			<SpendMixChartContent chartData={chartData} />
		</>
	) : (
		<ChartPlaceholder />
	);
