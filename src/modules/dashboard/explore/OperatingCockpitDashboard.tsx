import Link from "next/link";
import { getPercentage } from "@/modules/money/format";
import { ProgressBar } from "@/ui/components/feedback/ProgressBar";
import { getCashActionDestination } from "../cashActionDestination";
import { CashOutlookChart } from "../components/CashOutlookChart";
import { formatDashboardDate } from "../overviewDateRangeLabel";
import type { DashboardViewModel } from "../types";
import { CASH_ACTION_NEXT_STEP, CASH_ACTION_WORK, type ExplorePresentation, formatExploreMoney } from "./exploreModel";
import { ExploreKicker, ExploreLink, ExploreMoney, PriorityCue, SupportNoteList } from "./exploreUi";

type OperatingCockpitDashboardProps = {
	basePath: string;
	dashboard: DashboardViewModel;
	presentation: ExplorePresentation;
};

export const OperatingCockpitDashboard = ({ basePath, dashboard, presentation }: OperatingCockpitDashboardProps) => {
	const primaryAction = presentation.primaryAction;
	const belowBuffer =
		dashboard.lowestProjectedCashCents !== undefined &&
		dashboard.lowestProjectedCashCents < dashboard.cashBufferTargetCents;

	return (
		<div className="space-y-8">
			<header className="border-border border-b pb-6">
				<p className="text-muted-foreground text-s">
					{dashboard.companyName} · {dashboard.dateRangeLabel}
				</p>

				<h1 className="mt-2 max-w-4xl font-semibold text-3xl+ text-panel-foreground tracking-normal">
					{dashboard.cashPositionHeadline}
				</h1>

				<dl className="mt-5 grid gap-4 sm:grid-cols-3">
					<div>
						<dt className="text-muted-foreground text-s">Cash on hand</dt>

						<dd>
							<ExploreMoney cents={dashboard.cashAvailableCents} className="text-3xl+" />
						</dd>
					</div>

					<div>
						<dt className="text-muted-foreground text-s">Lowest week</dt>

						<dd>
							<ExploreMoney
								cents={dashboard.lowestProjectedCashCents ?? dashboard.cashAvailableCents}
								className="text-3xl+"
								warning={belowBuffer}
							/>
						</dd>
						{dashboard.lowestProjectedCashDate && (
							<p className="mt-1 text-muted-foreground text-s">
								{formatDashboardDate(dashboard.lowestProjectedCashDate)}
							</p>
						)}
					</div>

					<div>
						<dt className="text-muted-foreground text-s">Money at risk</dt>

						<dd>
							<ExploreMoney
								cents={dashboard.cashAtRiskCents}
								className="text-3xl+"
								warning={dashboard.cashAtRiskCents > 0}
							/>
						</dd>
					</div>
				</dl>
			</header>

			<section className="grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
				<div className="min-w-0">
					<div className="flex flex-wrap items-end justify-between gap-3">
						<div>
							<ExploreKicker>Priorities</ExploreKicker>

							<h2 className="mt-1 text-panel-foreground text-xl+">Today’s Cash Actions</h2>
						</div>

						{presentation.inactionLines[0] && (
							<p className="max-w-sm text-muted-foreground text-s leading-5">{presentation.inactionLines[0]}</p>
						)}
					</div>

					{primaryAction ? (
						<div className="mt-4 border-border border-b pb-5">
							<div className="flex flex-wrap items-center gap-x-3 gap-y-1">
								<PriorityCue priority={primaryAction.priority} />

								<span className="text-muted-foreground text-s">{CASH_ACTION_WORK[primaryAction.type]}</span>

								<span className="text-muted-foreground text-s">Due {formatDashboardDate(primaryAction.dueDate)}</span>
							</div>

							<p className="mt-2 font-semibold text-2xl+ text-panel-foreground">{primaryAction.title}</p>

							<p className="mt-2 text-m text-shell-muted leading-6">{primaryAction.description}</p>

							<div className="mt-4 flex flex-wrap items-center gap-3">
								<ExploreMoney cents={primaryAction.impactCents} className="text-2xl+" exact />

								<ExploreLink href={getCashActionDestination(primaryAction.type, basePath)} primary>
									{CASH_ACTION_NEXT_STEP[primaryAction.type]}
								</ExploreLink>
							</div>
						</div>
					) : (
						<p className="mt-4 text-m text-muted-foreground">You are clear for today.</p>
					)}

					{presentation.remainingActions.length > 0 && (
						<ol className="divide-y divide-border">
							{presentation.remainingActions.map((action) => (
								<li key={action.id}>
									<Link
										className="flex flex-col gap-2 py-4 outline-none transition-colors hover:text-primary focus-visible:ring-[3px] focus-visible:ring-primary/20 sm:flex-row sm:items-start sm:justify-between"
										href={getCashActionDestination(action.type, basePath)}
									>
										<span className="min-w-0">
											<span className="flex flex-wrap items-center gap-x-3 gap-y-1">
												<PriorityCue priority={action.priority} />

												<span className="text-muted-foreground text-s">{CASH_ACTION_WORK[action.type]}</span>
											</span>

											<span className="mt-1 block font-semibold text-m+ text-panel-foreground">{action.title}</span>
										</span>

										<ExploreMoney cents={action.impactCents} className="shrink-0" exact />
									</Link>
								</li>
							))}
						</ol>
					)}
				</div>

				<div className="min-w-0">
					<ExploreKicker>Future</ExploreKicker>

					<h2 className="mt-1 text-panel-foreground text-xl+">
						{dashboard.lowestProjectedCashDate && dashboard.lowestProjectedCashCents !== undefined
							? `Lowest week ${formatExploreMoney(dashboard.lowestProjectedCashCents)} on ${formatDashboardDate(dashboard.lowestProjectedCashDate)}`
							: "13-week cash outlook"}
					</h2>

					<div className="mt-4">
						<CashOutlookChart
							bufferTargetCents={dashboard.cashBufferTargetCents}
							chartData={dashboard.forecastChartData}
							lowestProjectedCashDate={dashboard.lowestProjectedCashDate}
						/>
					</div>
				</div>
			</section>

			<section className="border-border border-t pt-8">
				<ExploreKicker>Supporting work</ExploreKicker>

				<h2 className="mt-1 text-panel-foreground text-xl+">Approvals, collection, vendor leaks, and guardrails</h2>

				<div className="mt-5 grid gap-8 lg:grid-cols-12">
					<div className="min-w-0 lg:col-span-7">
						<p className="font-semibold text-m+ text-panel-foreground">Spend requests to decide</p>

						{dashboard.pendingApprovals.length ? (
							<ul className="mt-3 divide-y divide-border border-border border-t">
								{dashboard.pendingApprovals.map(({ amountCents, id, reason, requester, team, vendor }) => (
									<li key={id} className="flex items-start justify-between gap-3 py-3">
										<div className="min-w-0">
											<p className="font-semibold text-m+ text-panel-foreground">{vendor}</p>

											<p className="mt-1 text-muted-foreground text-s">
												{requester} · {team}
											</p>

											<p className="mt-1 text-m text-muted-foreground leading-6">{reason}</p>
										</div>

										<ExploreMoney cents={amountCents} exact />
									</li>
								))}
							</ul>
						) : (
							<p className="mt-3 text-m text-muted-foreground">No pending spend requests.</p>
						)}

						<Link
							className="mt-3 inline-flex min-h-11 items-center text-m text-primary hover:underline"
							href={`${basePath}/approvals`}
						>
							View all approvals
						</Link>
					</div>

					<div className="min-w-0 lg:col-span-5">
						<p className="font-semibold text-m+ text-panel-foreground">
							{presentation.recoverableCents > 0
								? `${formatExploreMoney(presentation.recoverableCents)} to collect or cut`
								: "Collect and cut"}
						</p>

						<ul className="mt-3 divide-y divide-border border-border border-t">
							{dashboard.overdueInvoices.map(({ amountCents, client, id, owner }) => (
								<li key={id} className="flex items-start justify-between gap-3 py-3">
									<div className="min-w-0">
										<p className="font-semibold text-m+ text-panel-foreground">{client}</p>

										<p className="mt-1 text-muted-foreground text-s">Overdue · {owner}</p>
									</div>

									<ExploreMoney cents={amountCents} exact />
								</li>
							))}

							{dashboard.vendorLeaks.map(({ amountCents, id, usagePercent, vendor }) => (
								<li key={id} className="flex items-start justify-between gap-3 py-3">
									<div className="min-w-0">
										<p className="font-semibold text-m+ text-panel-foreground">{vendor}</p>

										<p className="mt-1 text-muted-foreground text-s">
											Vendor leak · {getPercentage(usagePercent)} used
										</p>
									</div>

									<ExploreMoney cents={amountCents} exact />
								</li>
							))}

							{!dashboard.overdueInvoices.length && !dashboard.vendorLeaks.length && (
								<li className="py-3 text-m text-muted-foreground">No overdue invoices or vendor leaks need action.</li>
							)}
						</ul>
					</div>

					<div className="min-w-0 lg:col-span-12">
						<p className="font-semibold text-m+ text-panel-foreground">Team budget guardrails</p>

						{dashboard.budgetRows.length ? (
							<ul className="mt-4 grid gap-4 md:grid-cols-3">
								{dashboard.budgetRows.map(({ id, remainingCents, team, usagePercent }) => (
									<li key={id}>
										<ProgressBar
											label={`${team} · ${formatExploreMoney(remainingCents)} ${remainingCents >= 0 ? "left" : "over budget"}`}
											value={usagePercent}
										/>
									</li>
								))}
							</ul>
						) : (
							<p className="mt-3 text-m text-muted-foreground">No team budgets for this range.</p>
						)}
					</div>
				</div>
			</section>

			<SupportNoteList notes={presentation.supportNotes} />
		</div>
	);
};
