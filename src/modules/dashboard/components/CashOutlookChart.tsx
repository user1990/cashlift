import { formatCurrencyDollars } from "@/modules/money/format";
import type { ForecastChartDataPoint } from "../types";
import { ChartPlaceholder } from "./ChartPlaceholder";

const CHART_HEIGHT = 245;
const CHART_WIDTH = 640;
const PADDING_BOTTOM = 28;
const PADDING_LEFT = 54;
const PADDING_RIGHT = 10;
const PADDING_TOP = 14;
const TICK_COUNT = 4;

type CashOutlookChartProps = {
	chartData: ForecastChartDataPoint[];
	chartsReady: boolean;
};

export const CashOutlookChart = ({ chartData, chartsReady }: CashOutlookChartProps) =>
	chartsReady ? (
		<>
			<CashOutlookChartSummary chartData={chartData} />

			<CashOutlookChartContent chartData={chartData} />
		</>
	) : (
		<ChartPlaceholder />
	);

type CashOutlookChartContentProps = {
	chartData: ForecastChartDataPoint[];
};

const CashOutlookChartContent = ({ chartData }: CashOutlookChartContentProps) => {
	const balances = chartData.map(({ balance }) => balance);
	const minimumBalance = Math.min(...balances);
	const maximumBalance = Math.max(...balances);
	const chartAreaWidth = CHART_WIDTH - PADDING_LEFT - PADDING_RIGHT;
	const chartAreaHeight = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM;
	const balanceRange = Math.max(1, maximumBalance - minimumBalance);
	const points = chartData.map((point, pointIndex) => {
		const xPosition =
			PADDING_LEFT + (chartData.length <= 1 ? 0 : (pointIndex / (chartData.length - 1)) * chartAreaWidth);
		const yPosition = PADDING_TOP + ((maximumBalance - point.balance) / balanceRange) * chartAreaHeight;

		return { ...point, xPosition, yPosition };
	});
	const areaPath = `${buildLinePath(points)} L ${points.at(-1)?.xPosition ?? PADDING_LEFT} ${
		CHART_HEIGHT - PADDING_BOTTOM
	} L ${PADDING_LEFT} ${CHART_HEIGHT - PADDING_BOTTOM} Z`;

	return (
		<svg
			aria-labelledby="cash-outlook-chart-title"
			className="h-[245px] w-full overflow-visible"
			focusable="false"
			role="img"
			viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
		>
			<title id="cash-outlook-chart-title">13-week cash outlook trend</title>

			<defs>
				<linearGradient id="cashOutlookFill" x1="0" x2="0" y1="0" y2="1">
					<stop offset="0%" stopColor="var(--primary)" stopOpacity="0.45" />

					<stop offset="100%" stopColor="var(--primary)" stopOpacity="0.02" />
				</linearGradient>
			</defs>

			{getBalanceTicks(minimumBalance, maximumBalance).map((tick) => {
				const yPosition = PADDING_TOP + ((maximumBalance - tick) / balanceRange) * chartAreaHeight;

				return (
					<g key={tick}>
						<line
							stroke="var(--border)"
							strokeOpacity="0.8"
							x1={PADDING_LEFT}
							x2={CHART_WIDTH - PADDING_RIGHT}
							y1={yPosition}
							y2={yPosition}
						/>

						<text
							className="fill-muted-foreground font-sans text-xs"
							textAnchor="end"
							x={PADDING_LEFT - 10}
							y={yPosition + 4}
						>
							{formatMillions(tick)}
						</text>
					</g>
				);
			})}

			<path d={areaPath} fill="url(#cashOutlookFill)" />

			<path d={buildLinePath(points)} fill="none" stroke="var(--primary)" strokeWidth="3" />

			{points.map(({ rowKey, week, xPosition, yPosition }) => (
				<g key={rowKey}>
					<circle cx={xPosition} cy={yPosition} fill="var(--primary)" r="4" stroke="var(--shell)" strokeWidth="2" />

					<text
						className="fill-muted-foreground font-sans text-xs"
						textAnchor="middle"
						x={xPosition}
						y={CHART_HEIGHT - 7}
					>
						{week.slice(5)}
					</text>
				</g>
			))}
		</svg>
	);
};

const CashOutlookChartSummary = ({ chartData }: CashOutlookChartContentProps) => (
	<table className="sr-only">
		<caption>13-week cash outlook by week</caption>

		<thead>
			<tr>
				<th scope="col">Week</th>

				<th scope="col">Projected balance</th>

				<th scope="col">Inflow</th>

				<th scope="col">Outflow</th>
			</tr>
		</thead>

		<tbody>
			{chartData.map(({ balance, inflow, outflow, rowKey, week }) => (
				<tr key={rowKey}>
					<th scope="row">{week.slice(5)}</th>

					<td>{formatCurrencyDollars(balance)}</td>

					<td>{formatCurrencyDollars(inflow)}</td>

					<td>{formatCurrencyDollars(outflow)}</td>
				</tr>
			))}
		</tbody>
	</table>
);

function buildLinePath(points: { xPosition: number; yPosition: number }[]) {
	return points
		.map(({ xPosition, yPosition }, pointIndex) => `${pointIndex === 0 ? "M" : "L"} ${xPosition} ${yPosition}`)
		.join(" ");
}

function getBalanceTicks(minimumBalance: number, maximumBalance: number) {
	const balanceRange = Math.max(1, maximumBalance - minimumBalance);

	return Array.from(
		{ length: TICK_COUNT },
		(_, tickIndex) => maximumBalance - (tickIndex / (TICK_COUNT - 1)) * balanceRange,
	);
}

function formatMillions(value: number) {
	return `$${(value / 1_000_000).toFixed(1)}M`;
}
