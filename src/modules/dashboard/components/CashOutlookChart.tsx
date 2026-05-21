import type { ForecastChartDataPoint } from "../types";
import { CashOutlookChartContent } from "./CashOutlookChartContent";
import { CashOutlookChartSummary } from "./CashOutlookChartSummary";
import { ChartPlaceholder } from "./ChartPlaceholder";

type CashOutlookChartProps = {
	chartData: ForecastChartDataPoint[];
	chartsReady?: boolean;
};

export const CashOutlookChart = ({ chartData, chartsReady = false }: CashOutlookChartProps) =>
	chartsReady ? (
		<>
			<CashOutlookChartSummary chartData={chartData} />

			<CashOutlookChartContent chartData={chartData} />
		</>
	) : (
		<ChartPlaceholder />
	);
