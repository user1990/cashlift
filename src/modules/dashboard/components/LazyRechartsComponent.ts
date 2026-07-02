import dynamic from "next/dynamic";
import type { ComponentType, ReactNode } from "react";
import { createElement } from "react";

type RechartsComponentProps = Record<string, unknown> & {
	children?: ReactNode;
};

const DEFAULT_AXIS_TICK = { fill: "var(--muted-foreground)", fontSize: 12 } as const;
const DEFAULT_CHART_MARGIN = { bottom: 0, left: 4, right: 8, top: 12 } as const;
const DEFAULT_TICK_COUNT = 4;
const DEFAULT_TOOLTIP_CONTENT_STYLE = {
	background: "var(--panel)",
	border: "1px solid var(--border)",
	borderRadius: 8,
	color: "var(--panel-foreground)",
} as const;

const LazyRechartsArea = lazyRechartsComponent("Area");
const LazyRechartsAreaChart = lazyRechartsComponent("AreaChart");
const LazyRechartsBar = lazyRechartsComponent("Bar");
const LazyRechartsBarChart = lazyRechartsComponent("BarChart");
const LazyRechartsCartesianGrid = lazyRechartsComponent("CartesianGrid");
const LazyRechartsResponsiveContainer = lazyRechartsComponent("ResponsiveContainer");
const LazyRechartsTooltip = lazyRechartsComponent("Tooltip");
const LazyRechartsXAxis = lazyRechartsComponent("XAxis");
const LazyRechartsYAxis = lazyRechartsComponent("YAxis");

export const RechartsArea = (props: RechartsComponentProps) =>
	createElement(LazyRechartsArea, { isAnimationActive: true, ...props });

export const RechartsAreaChart = (props: RechartsComponentProps) =>
	createElement(LazyRechartsAreaChart, { margin: DEFAULT_CHART_MARGIN, ...props });

export const RechartsBar = (props: RechartsComponentProps) =>
	createElement(LazyRechartsBar, { isAnimationActive: true, radius: [6, 6, 0, 0], ...props });

export const RechartsBarChart = (props: RechartsComponentProps) =>
	createElement(LazyRechartsBarChart, { margin: DEFAULT_CHART_MARGIN, ...props });

export const RechartsCartesianGrid = (props: RechartsComponentProps) =>
	createElement(LazyRechartsCartesianGrid, {
		stroke: "var(--border)",
		strokeOpacity: 0.8,
		vertical: false,
		...props,
	});

export const RechartsResponsiveContainer = (props: RechartsComponentProps) =>
	createElement(LazyRechartsResponsiveContainer, {
		height: "100%",
		minHeight: 0,
		minWidth: 0,
		width: "100%",
		...props,
	});

export const RechartsTooltip = (props: RechartsComponentProps) =>
	createElement(LazyRechartsTooltip, { contentStyle: DEFAULT_TOOLTIP_CONTENT_STYLE, ...props });

export const RechartsXAxis = (props: RechartsComponentProps) =>
	createElement(LazyRechartsXAxis, {
		axisLine: false,
		tick: DEFAULT_AXIS_TICK,
		tickLine: false,
		...props,
	});

export const RechartsYAxis = (props: RechartsComponentProps) =>
	createElement(LazyRechartsYAxis, {
		axisLine: false,
		tick: DEFAULT_AXIS_TICK,
		tickCount: DEFAULT_TICK_COUNT,
		tickLine: false,
		width: 48,
		...props,
	});

function lazyRechartsComponent<T extends keyof typeof import("recharts")>(name: T) {
	return dynamic(
		() =>
			import("recharts").then((mod) => ({
				default: mod[name] as unknown as ComponentType<RechartsComponentProps>,
			})),
		{ ssr: false },
	);
}
