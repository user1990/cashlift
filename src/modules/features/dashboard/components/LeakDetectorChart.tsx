"use client";

import { lazy, Suspense } from "react";
import type { LeakChartDataPoint } from "../types";
import { ChartPlaceholder } from "./ChartPlaceholder";

type LeakDetectorChartProps = {
	chartData: LeakChartDataPoint[];
};

const LeakDetectorRecharts = lazy(() =>
	import("recharts").then(
		({
			Bar,
			BarChart,
			CartesianGrid,
			ResponsiveContainer,
			Tooltip,
			XAxis,
			YAxis,
		}) => {
			function LeakDetectorChartInner({ chartData }: LeakDetectorChartProps) {
				return (
					<ResponsiveContainer height={224} minWidth={0} width="100%">
						<BarChart data={chartData}>
							<CartesianGrid stroke="#E8E8EC" vertical={false} />

							<XAxis axisLine={false} dataKey="merchant" tickLine={false} />

							<YAxis axisLine={false} tickLine={false} />

							<Tooltip formatter={(value) => [`$${value}`, "Monthly leak"]} />

							<Bar dataKey="leak" fill="#6366F1" radius={[6, 6, 0, 0]} />
						</BarChart>
					</ResponsiveContainer>
				);
			}

			return { default: LeakDetectorChartInner };
		},
	),
);

export const LeakDetectorChart = (props: LeakDetectorChartProps) => (
	<Suspense fallback={<ChartPlaceholder />}>
		<LeakDetectorRecharts {...props} />
	</Suspense>
);
