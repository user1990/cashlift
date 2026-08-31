import { Shield } from "lucide-react";
import type { ReactNode } from "react";
import type { MoneyCents } from "@/modules/money/types";
import { CashOutlookChart } from "../components/CashOutlookChart";
import { formatDashboardDate } from "../overviewDateRangeLabel";
import type { DashboardViewModel } from "../types";
import { ExploreKicker, ExploreMoney } from "./exploreUi";
import { GlassCard } from "./GlassCard";

type CockpitStatusMetricsProps = {
	dashboard: DashboardViewModel;
	thirdMetric: ReactNode;
};

export const CockpitStatusMetrics = ({ dashboard, thirdMetric }: CockpitStatusMetricsProps) => (
	<>
		<h1 className="mt-3 max-w-4xl font-semibold text-3xl+ text-panel-foreground tracking-normal">
			{dashboard.cashPositionHeadline}
		</h1>

		<dl className="mt-6 grid gap-5 sm:grid-cols-3">
			<CockpitMetric cents={dashboard.cashAvailableCents} label="Cash on hand" />

			<CockpitMetric
				cents={dashboard.cashBufferTargetCents}
				icon={<Shield aria-hidden className="size-3.5 text-primary" />}
				label="Cash buffer"
			/>

			{thirdMetric}
		</dl>
	</>
);

type CockpitOutlookCardProps = {
	dashboard: DashboardViewModel;
	belowBuffer: boolean;
};

export const CockpitOutlookCard = ({ belowBuffer, dashboard }: CockpitOutlookCardProps) => (
	<div id="cash-outlook">
		<GlassCard atmosphere="outlook">
			<ExploreKicker>Future</ExploreKicker>

			<h2 className="mt-1 text-panel-foreground text-xl+">13-week Cash Outlook</h2>

			{dashboard.lowestProjectedCashDate && dashboard.lowestProjectedCashCents !== undefined && (
				<p className={belowBuffer ? "mt-1 text-s text-warning" : "mt-1 text-muted-foreground text-s"}>
					Lowest week <ExploreMoney cents={dashboard.lowestProjectedCashCents} /> on{" "}
					{formatDashboardDate(dashboard.lowestProjectedCashDate)}
				</p>
			)}

			<div className="mt-4">
				<CashOutlookChart
					bufferTargetCents={dashboard.cashBufferTargetCents}
					chartData={dashboard.forecastChartData}
					lowestProjectedCashDate={dashboard.lowestProjectedCashDate}
				/>
			</div>
		</GlassCard>
	</div>
);

type CockpitSupportCardProps = {
	children: ReactNode;
	title: string;
};

export const CockpitSupportCard = ({ children, title }: CockpitSupportCardProps) => (
	<GlassCard atmosphere="support">
		<ExploreKicker>Supporting work</ExploreKicker>

		<h2 className="mt-1 text-panel-foreground text-xl+">{title}</h2>

		<div className="mt-5 grid gap-8 lg:grid-cols-12">{children}</div>
	</GlassCard>
);

type CockpitMetricProps = {
	cents: MoneyCents;
	label: string;
	icon?: ReactNode;
	warning?: boolean;
};

function CockpitMetric({ cents, label, icon, warning = false }: CockpitMetricProps) {
	return (
		<div>
			<dt className={icon ? "flex items-center gap-1.5 text-muted-foreground text-s" : "text-muted-foreground text-s"}>
				{icon}

				{label}
			</dt>

			<dd>
				<ExploreMoney cents={cents} className="text-3xl+" warning={warning} />
			</dd>
		</div>
	);
}
