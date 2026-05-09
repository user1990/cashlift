"use client";

import { TrendingUp } from "lucide-react";
import { formatCurrency } from "@/modules/common/money/format";
import { Panel, PanelHeader } from "@/modules/ui/components/Panel";
import type { NetWorthChartDataPoint } from "../types";
import { ChartPlaceholder } from "./ChartPlaceholder";
import { NetWorthChart } from "./NetWorthChart";

type NetWorthPanelProps = {
	chartData: NetWorthChartDataPoint[];
	chartsReady: boolean;
	changeCents: number;
	currentCents: number;
};

export const NetWorthPanel = ({
	chartData,
	chartsReady,
	changeCents,
	currentCents,
}: NetWorthPanelProps) => (
	<Panel>
		<PanelHeader
			action={
				<span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
					<TrendingUp aria-hidden className="size-3" />
					{formatCurrency(changeCents)} WoW
				</span>
			}
			eyebrow="Direction"
			title={`Net worth ${formatCurrency(currentCents)}`}
		/>

		<div className="h-64 min-h-0 min-w-0 w-full">
			{chartsReady ? (
				<NetWorthChart chartData={chartData} />
			) : (
				<ChartPlaceholder />
			)}
		</div>
	</Panel>
);
