"use client";

import { TrendingUp } from "lucide-react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { formatCurrency } from "@/modules/common/money/format";
import { Panel, PanelHeader } from "@/modules/ui/components/Panel";
import type { NetWorthChartDataPoint } from "../types";
import { ChartPlaceholder } from "./ChartPlaceholder";

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

		<div className="h-64 min-w-0">
			{chartsReady ? (
				<ResponsiveContainer height="100%" width="100%">
					<AreaChart data={chartData}>
						<CartesianGrid stroke="#E8E8EC" vertical={false} />

						<XAxis axisLine={false} dataKey="week" tickLine={false} />

						<YAxis
							axisLine={false}
							tickFormatter={(value) => `$${value}k`}
							tickLine={false}
						/>

						<Tooltip formatter={(value) => [`$${value}`, "Net worth"]} />

						<Area
							dataKey="netWorth"
							fill="#6366F1"
							fillOpacity={0.12}
							stroke="#6366F1"
							strokeWidth={2}
							type="monotone"
						/>
					</AreaChart>
				</ResponsiveContainer>
			) : (
				<ChartPlaceholder />
			)}
		</div>
	</Panel>
);
