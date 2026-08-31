import { Shield } from "lucide-react";
import Link from "next/link";
import { ProgressBar } from "@/ui/components/feedback/ProgressBar";
import { CashOutlookChart } from "../components/CashOutlookChart";
import { formatDashboardDate } from "../overviewDateRangeLabel";
import type { DashboardViewModel } from "../types";
import type { CashInsightsPresentation } from "./cashInsightsModel";
import { ExploreKicker, ExploreLink, ExploreMoney } from "./exploreUi";
import { GlassCard } from "./GlassCard";

type CashInsightsDashboardProps = {
	basePath: string;
	dashboard: DashboardViewModel;
	presentation: CashInsightsPresentation;
};

export const CashInsightsDashboard = ({ basePath, dashboard, presentation }: CashInsightsDashboardProps) => {
	const belowBuffer =
		dashboard.lowestProjectedCashCents !== undefined &&
		dashboard.lowestProjectedCashCents < dashboard.cashBufferTargetCents;

	return (
		<div className="space-y-4 xl:space-y-5">
			<GlassCard atmosphere="status">
				<div className="flex flex-wrap items-start justify-between gap-3">
					<p className="text-muted-foreground text-s">
						{dashboard.companyName} · Cash Insights · {dashboard.dateRangeLabel}
					</p>

					<p className="text-muted-foreground text-s">{dashboard.runwayDays} days runway</p>
				</div>

				<h1 className="mt-3 max-w-4xl font-semibold text-3xl+ text-panel-foreground tracking-normal">
					{dashboard.cashPositionHeadline}
				</h1>

				<dl className="mt-6 grid gap-5 sm:grid-cols-3">
					<div>
						<dt className="text-muted-foreground text-s">Cash on hand</dt>

						<dd>
							<ExploreMoney cents={dashboard.cashAvailableCents} className="text-3xl+" />
						</dd>
					</div>

					<div>
						<dt className="flex items-center gap-1.5 text-muted-foreground text-s">
							<Shield aria-hidden className="size-3.5 text-primary" />
							Cash buffer
						</dt>

						<dd>
							<ExploreMoney cents={dashboard.cashBufferTargetCents} className="text-3xl+" />
						</dd>
					</div>

					<div>
						<dt className="text-muted-foreground text-s">Monthly payroll</dt>

						<dd>
							<ExploreMoney cents={dashboard.monthlyPayrollCents} className="text-3xl+" />
						</dd>
					</div>
				</dl>
			</GlassCard>

			<section className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:gap-5">
				<GlassCard atmosphere="priority" className="h-full" contentClassName="flex h-full flex-col" intensity="active">
					<ExploreKicker>Buffer</ExploreKicker>

					<h2 className="mt-3 font-semibold text-2xl+ text-panel-foreground tracking-normal">
						{presentation.aboveBuffer
							? "Cash on hand covers the cash buffer"
							: "Cash on hand is short of the cash buffer"}
					</h2>

					<p className="mt-3 text-m text-shell-muted leading-6">
						{dashboard.runwayDays} days runway from cash on hand and recurring spend.
					</p>

					<p className="mt-5">
						<ExploreMoney
							cents={presentation.aboveBuffer ? presentation.surplusCents : presentation.shortfallCents}
							className="text-2xl+"
							exact
							warning={!presentation.aboveBuffer}
						/>

						<span className="ml-2 text-muted-foreground text-s">
							{presentation.aboveBuffer ? "above the cash buffer" : "below the cash buffer"}
						</span>
					</p>

					{dashboard.bufferRiskCents > 0 && (
						<p className="mt-3 text-s text-warning">
							14-day projection leaves <ExploreMoney cents={dashboard.bufferRiskCents} exact warning /> below the cash
							buffer
						</p>
					)}

					{presentation.cashWork && (
						<p className="mt-3 text-m text-shell-muted leading-6">{presentation.cashWork.description}</p>
					)}

					<div className="mt-6">
						<ExploreLink className="min-h-12 rounded-lg px-4" href="#cash-outlook" primary>
							Review the cash outlook
						</ExploreLink>
					</div>
				</GlassCard>

				<div className="grid min-w-0 gap-4 xl:gap-5">
					<GlassCard atmosphere="queue">
						<ExploreKicker>Movement</ExploreKicker>

						<h2 className="mt-1 text-panel-foreground text-xl+">Cash already spoken for</h2>

						<ul className="mt-4 divide-y divide-white/10">
							{getMovementRows(dashboard).map(({ cents, label }) => (
								<li key={label} className="flex items-start justify-between gap-3 py-3">
									<p className="font-semibold text-m+ text-panel-foreground">{label}</p>

									<ExploreMoney cents={cents} exact />
								</li>
							))}
						</ul>
					</GlassCard>

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
				</div>
			</section>

			<GlassCard atmosphere="support">
				<ExploreKicker>Supporting work</ExploreKicker>

				<h2 className="mt-1 text-panel-foreground text-xl+">Payroll and reserve context</h2>

				<div className="mt-5 grid gap-8 lg:grid-cols-12">
					<div className="min-w-0 lg:col-span-7">
						<p className="font-semibold text-m+ text-panel-foreground">Payroll against cash on hand</p>

						<p className="mt-3">
							<ExploreMoney cents={dashboard.monthlyPayrollCents} exact />

							{presentation.payrollShareLabel && (
								<span className="ml-2 text-muted-foreground text-s">
									{presentation.payrollShareLabel} of cash on hand
								</span>
							)}
						</p>

						<Link
							className="mt-3 inline-flex min-h-11 items-center text-m text-primary hover:underline"
							href={basePath}
						>
							Back to overview
						</Link>
					</div>

					<div className="min-w-0 lg:col-span-5">
						<p className="font-semibold text-m+ text-panel-foreground">Ending cash in this outlook</p>

						<ul className="mt-3 divide-y divide-white/10">
							<li className="flex items-start justify-between gap-3 py-3">
								<p className="font-semibold text-m+ text-panel-foreground">Ending cash</p>

								<ExploreMoney cents={dashboard.endingCashBalanceCents} exact />
							</li>

							{dashboard.lowestProjectedCashCents !== undefined && dashboard.lowestProjectedCashDate && (
								<li className="flex items-start justify-between gap-3 py-3">
									<div className="min-w-0">
										<p className="font-semibold text-m+ text-panel-foreground">Lowest week</p>

										<p className="mt-1 text-muted-foreground text-s">
											{formatDashboardDate(dashboard.lowestProjectedCashDate)}
										</p>
									</div>

									<ExploreMoney cents={dashboard.lowestProjectedCashCents} exact warning={belowBuffer} />
								</li>
							)}
						</ul>
					</div>

					{presentation.bufferSharePercent !== undefined && presentation.bufferShareLabel && (
						<div className="min-w-0 lg:col-span-12">
							<p className="font-semibold text-m+ text-panel-foreground">Cash buffer as a share of cash on hand</p>

							<div className="mt-4">
								<ProgressBar
									label={`Cash buffer · ${presentation.bufferShareLabel} of cash on hand`}
									value={presentation.bufferSharePercent}
								/>
							</div>
						</div>
					)}
				</div>
			</GlassCard>
		</div>
	);
};

function getMovementRows(dashboard: DashboardViewModel) {
	return [
		{ cents: dashboard.projectedReceivablesCents, label: "Projected receivables" },
		{ cents: dashboard.projectedOutflowCents, label: "Projected outflow" },
		{ cents: dashboard.totalCommittedSpendCents, label: "Committed spend" },
		{ cents: dashboard.totalUncommittedCents, label: "Uncommitted after buffer" },
	];
}
