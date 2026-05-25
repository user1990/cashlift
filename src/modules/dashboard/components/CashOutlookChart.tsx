import type { ForecastChartDataPoint } from "../types";
import { CashOutlookChartContent } from "./CashOutlookChartContent";
import { CashOutlookChartSummary } from "./CashOutlookChartSummary";

type CashOutlookChartProps = {
	chartData: ForecastChartDataPoint[];
};

export const CashOutlookChart = ({ chartData }: CashOutlookChartProps) => (
	<>
		<CashOutlookChartSummary chartData={chartData} />

		<CashOutlookChartContent chartData={chartData} />
	</>
);
