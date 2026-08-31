import type { MoneyCents } from "@/modules/money/types";
import type { ForecastChartDataPoint } from "../types";
import { CashOutlookChartContent } from "./CashOutlookChartContent";
import { CashOutlookChartSummary } from "./CashOutlookChartSummary";

type CashOutlookChartProps = {
	bufferTargetCents: MoneyCents;
	chartData: ForecastChartDataPoint[];
	lowestProjectedCashDate?: string;
};

export const CashOutlookChart = ({ bufferTargetCents, chartData, lowestProjectedCashDate }: CashOutlookChartProps) => (
	<>
		<CashOutlookChartSummary
			bufferTargetCents={bufferTargetCents}
			chartData={chartData}
			lowestProjectedCashDate={lowestProjectedCashDate}
		/>

		<CashOutlookChartContent
			bufferTargetCents={bufferTargetCents}
			chartData={chartData}
			lowestProjectedCashDate={lowestProjectedCashDate}
		/>
	</>
);
