"use client";

import { lazy, Suspense } from "react";
import type { NetWorthChartDataPoint } from "../types";
import { ChartPlaceholder } from "./ChartPlaceholder";

type NetWorthChartProps = {
	chartData: NetWorthChartDataPoint[];
};

const NetWorthRecharts = lazy(() =>
	import("recharts").then(
		({
			Area,
			AreaChart,
			CartesianGrid,
			ResponsiveContainer,
			Tooltip,
			XAxis,
			YAxis,
		}) => {
			const NetWorthChartInner = ({ chartData }: NetWorthChartProps) => (
				<ResponsiveContainer height={256} minWidth={0} width="100%">
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
			);

			return { default: NetWorthChartInner };
		},
	),
);

export const NetWorthChart = (props: NetWorthChartProps) => (
	<Suspense fallback={<ChartPlaceholder />}>
		<NetWorthRecharts {...props} />
	</Suspense>
);
