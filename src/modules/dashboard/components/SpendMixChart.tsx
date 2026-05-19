import { formatCurrencyDollars } from "@/modules/money/format";
import type { SpendChartDataPoint } from "../types";
import { ChartPlaceholder } from "./ChartPlaceholder";

const BAR_GAP = 12;
const BAR_WIDTH = 36;
const CHART_HEIGHT = 245;
const CHART_WIDTH = 640;
const GROUP_GAP = 34;
const PADDING_BOTTOM = 30;
const PADDING_LEFT = 54;
const PADDING_RIGHT = 12;
const PADDING_TOP = 14;
const TICK_COUNT = 4;

type SpendMixChartProps = {
	chartData: SpendChartDataPoint[];
	chartsReady: boolean;
};

export const SpendMixChart = ({ chartData, chartsReady }: SpendMixChartProps) =>
	chartsReady ? (
		<>
			<SpendMixChartSummary chartData={chartData} />

			<SpendMixChartContent chartData={chartData} />
		</>
	) : (
		<ChartPlaceholder />
	);

type SpendMixChartContentProps = {
	chartData: SpendChartDataPoint[];
};

const SpendMixChartContent = ({ chartData }: SpendMixChartContentProps) => {
	const maximumValue = Math.max(...chartData.flatMap(({ remaining, used }) => [remaining, used]), 1);
	const chartAreaHeight = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM;
	const baseline = CHART_HEIGHT - PADDING_BOTTOM;

	return (
		<svg
			aria-labelledby="spend-mix-chart-title"
			className="h-[245px] w-full overflow-visible"
			focusable="false"
			role="img"
			viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
		>
			<title id="spend-mix-chart-title">Committed spend by team</title>

			<defs>
				<linearGradient id="budgetUsedFill" x1="0" x2="0" y1="0" y2="1">
					<stop offset="0%" stopColor="var(--primary)" />

					<stop offset="100%" stopColor="var(--primary-muted)" />
				</linearGradient>

				<linearGradient id="budgetRemainingFill" x1="0" x2="0" y1="0" y2="1">
					<stop offset="0%" stopColor="var(--highlight)" />

					<stop offset="100%" stopColor="var(--highlight-muted)" />
				</linearGradient>
			</defs>

			{getValueTicks(maximumValue).map((tick) => {
				const yPosition = baseline - (tick / maximumValue) * chartAreaHeight;

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
							{formatThousands(tick)}
						</text>
					</g>
				);
			})}

			{chartData.map(({ remaining, team, used }, itemIndex) => {
				const xPosition = getGroupXPosition(itemIndex);
				const remainingHeight = (remaining / maximumValue) * chartAreaHeight;
				const usedHeight = (used / maximumValue) * chartAreaHeight;

				return (
					<g key={team}>
						<rect
							fill="url(#budgetUsedFill)"
							height={usedHeight}
							rx="6"
							x={xPosition}
							y={baseline - usedHeight}
							width={BAR_WIDTH}
						/>

						<rect
							fill="url(#budgetRemainingFill)"
							height={remainingHeight}
							rx="6"
							x={xPosition + BAR_WIDTH + BAR_GAP}
							y={baseline - remainingHeight}
							width={BAR_WIDTH}
						/>

						<text
							className="fill-muted-foreground font-sans text-xs"
							textAnchor="middle"
							x={xPosition + BAR_WIDTH + BAR_GAP / 2}
							y={CHART_HEIGHT - 7}
						>
							{team}
						</text>
					</g>
				);
			})}
		</svg>
	);
};

const SpendMixChartSummary = ({ chartData }: SpendMixChartContentProps) => (
	<table className="sr-only">
		<caption>Budget used and remaining by team</caption>

		<thead>
			<tr>
				<th scope="col">Team</th>

				<th scope="col">Budget used</th>

				<th scope="col">Remaining budget</th>
			</tr>
		</thead>

		<tbody>
			{chartData.map(({ remaining, team, used }) => (
				<tr key={team}>
					<th scope="row">{team}</th>

					<td>{formatCurrencyDollars(used)}</td>

					<td>{formatCurrencyDollars(remaining)}</td>
				</tr>
			))}
		</tbody>
	</table>
);

function getGroupXPosition(itemIndex: number) {
	return PADDING_LEFT + itemIndex * (BAR_WIDTH * 2 + BAR_GAP + GROUP_GAP);
}

function getValueTicks(maximumValue: number) {
	return Array.from(
		{ length: TICK_COUNT },
		(_, tickIndex) => (maximumValue / (TICK_COUNT - 1)) * tickIndex,
	).toReversed();
}

function formatThousands(value: number) {
	return `$${Math.round(value / 1_000)}K`;
}
