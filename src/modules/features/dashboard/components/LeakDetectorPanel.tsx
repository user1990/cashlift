"use client";

import { formatCurrency, percentage } from "@/modules/common/money/format";
import { Panel, PanelHeader } from "@/modules/ui/components/Panel";
import type { LeakChartDataPoint, SpendingLeak } from "../types";
import { ChartPlaceholder } from "./ChartPlaceholder";
import { LeakDetectorChart } from "./LeakDetectorChart";

type LeakDetectorPanelProps = {
	chartData: LeakChartDataPoint[];
	chartsReady: boolean;
	leaks: SpendingLeak[];
};

export const LeakDetectorPanel = ({
	chartData,
	chartsReady,
	leaks,
}: LeakDetectorPanelProps) => (
	<Panel>
		<PanelHeader
			action={
				leaks[0] ? (
					<span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
						Cut {formatCurrency(leaks[0].monthlyLeakCents)}/mo first
					</span>
				) : null
			}
			eyebrow="Leaks"
			title="Recurring unnecessary spend"
		/>

		<div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
			<div className="h-56 min-h-0 min-w-0 w-full">
				{chartsReady ? (
					<LeakDetectorChart chartData={chartData} />
				) : (
					<ChartPlaceholder />
				)}
			</div>

			<div className="space-y-2">
				{leaks
					.slice(0, 4)
					.map(
						({
							id,
							merchant,
							monthlyLeakCents,
							monthlyOccurrences,
							avoidableScore,
						}) => (
							<div
								key={id}
								className="rounded-lg border border-[#E8E8EC] bg-[#FAFAFA] p-3"
							>
								<div className="flex items-center justify-between gap-3">
									<p className="text-sm font-semibold">{merchant}</p>

									<p className="font-mono text-sm">
										{formatCurrency(monthlyLeakCents)}
									</p>
								</div>

								<p className="mt-1 text-xs text-[#6B6B6B]">
									{monthlyOccurrences}x/month · {percentage(avoidableScore)}{" "}
									avoidable
								</p>
							</div>
						),
					)}
			</div>
		</div>
	</Panel>
);
