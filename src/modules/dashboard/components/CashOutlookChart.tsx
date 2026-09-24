"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { MoneyCents } from "@/modules/money/types";
import type { ForecastChartDataPoint } from "../types";
import { CashOutlookChartSummary } from "./CashOutlookChartSummary";

const LazyCashOutlookChartContent = dynamic(() => import("./CashOutlookChartContent"), {
	loading: () => <div aria-hidden className="h-60 rounded-lg bg-panel-muted motion-reduce:transition-none" />,
});

type CashOutlookChartProps = {
	bufferTargetCents: MoneyCents;
	chartData: ForecastChartDataPoint[];
	lowestProjectedCashDate?: string;
};

export const CashOutlookChart = ({ bufferTargetCents, chartData, lowestProjectedCashDate }: CashOutlookChartProps) => {
	const [showWeeklyValues, setShowWeeklyValues] = useState(false);

	return (
		<>
			<LazyCashOutlookChartContent
				bufferTargetCents={bufferTargetCents}
				chartData={chartData}
				lowestProjectedCashDate={lowestProjectedCashDate}
			/>

			<button
				aria-expanded={showWeeklyValues}
				className="focus-ring mt-4 inline-flex min-h-11 items-center text-m text-primary outline-none hover:underline"
				onClick={() => {
					setShowWeeklyValues((visible) => !visible);
				}}
				type="button"
			>
				{showWeeklyValues ? "Hide weekly values" : "Show weekly values"}
			</button>

			<CashOutlookChartSummary
				bufferTargetCents={bufferTargetCents}
				chartData={chartData}
				className={showWeeklyValues ? "mt-3 block w-full overflow-x-auto" : "sr-only"}
				lowestProjectedCashDate={lowestProjectedCashDate}
			/>
		</>
	);
};
