import { Shield } from "lucide-react";
import type { ReactNode } from "react";
import { MoneyDisplay } from "@/modules/money/components/MoneyDisplay";
import type { MoneyCents } from "@/modules/money/types";
import { GlassCard } from "@/ui/components/cockpit/GlassCard";
import { CashOutlookChart } from "../components/CashOutlookChart";
import { getCashOutlookSectionTitle } from "../outlookChartLabel";
import { formatDashboardDate } from "../overviewDateRangeLabel";
import type { DashboardViewModel } from "../types";

type CockpitStatusCardProps = {
	children: ReactNode;
	contextLine: string;
	headline: string;
};

export const CockpitStatusCard = ({ children, contextLine, headline }: CockpitStatusCardProps) => (
	<GlassCard atmosphere="status">
		<p className="text-muted-foreground text-s">{contextLine}</p>

		<h1 className="mt-3 max-w-4xl font-semibold text-3xl+ text-panel-foreground tracking-normal">{headline}</h1>

		<dl className="mt-6 grid gap-5 sm:grid-cols-3">{children}</dl>
	</GlassCard>
);

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

export const CockpitOutlookCard = ({ belowBuffer, dashboard }: CockpitOutlookCardProps) => {
	const weekCount = dashboard.forecastChartData.length;

	return (
		<div className="scroll-mt-20" id="cash-outlook">
			<GlassCard atmosphere="outlook">
				<h2 className="text-panel-foreground text-xl+">{getCashOutlookSectionTitle(weekCount)}</h2>

				{dashboard.lowestProjectedCashDate && dashboard.lowestProjectedCashCents !== undefined && (
					<p className={belowBuffer ? "mt-1 text-s text-warning" : "mt-1 text-muted-foreground text-s"}>
						Lowest week <MoneyDisplay cents={dashboard.lowestProjectedCashCents} /> on{" "}
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
};

type CockpitSupportCardProps = {
	children: ReactNode;
	title: string;
};

export const CockpitSupportCard = ({ children, title }: CockpitSupportCardProps) => (
	<GlassCard atmosphere="support">
		<h2 className="text-panel-foreground text-xl+">{title}</h2>

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
				<MoneyDisplay cents={cents} className="text-3xl+" warning={warning} />
			</dd>
		</div>
	);
}
