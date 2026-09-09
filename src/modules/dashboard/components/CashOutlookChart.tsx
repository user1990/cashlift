"use client";

import dynamic from "next/dynamic";
import type { MoneyCents } from "@/modules/money/types";
import type { ForecastChartDataPoint } from "../types";
import { CashOutlookChartSummary } from "./CashOutlookChartSummary";

const LazyCashOutlookChartContent = dynamic(() => import("./CashOutlookChartContent"));

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

		<LazyCashOutlookChartContent
			bufferTargetCents={bufferTargetCents}
			chartData={chartData}
			lowestProjectedCashDate={lowestProjectedCashDate}
		/>
	</>
);
