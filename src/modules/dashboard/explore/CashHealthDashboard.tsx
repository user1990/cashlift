import Link from "next/link";
import { getCashActionDestination } from "../cashActionDestination";
import { CashOutlookChart } from "../components/CashOutlookChart";
import { formatDashboardDate } from "../overviewDateRangeLabel";
import type { DashboardViewModel } from "../types";
import { CASH_ACTION_NEXT_STEP, CASH_ACTION_WORK, type ExplorePresentation, formatExploreMoney } from "./exploreModel";
import { ExploreKicker, ExploreLink, ExploreMoney, PriorityCue, SupportNoteList } from "./exploreUi";

type CashHealthDashboardProps = {
	basePath: string;
	dashboard: DashboardViewModel;
	presentation: ExplorePresentation;
};

export const CashHealthDashboard = ({ basePath, dashboard, presentation }: CashHealthDashboardProps) => {
	const belowBuffer =
		dashboard.lowestProjectedCashCents !== undefined &&
		dashboard.lowestProjectedCashCents < dashboard.cashBufferTargetCents;

	return (
		<div className="space-y-10">
			<header className="space-y-3">
				<ExploreKicker>Cash on hand</ExploreKicker>

				<h1>
					<ExploreMoney cents={dashboard.cashAvailableCents} className="text-6xl+ sm:text-7xl+" />
				</h1>

				<p className="max-w-3xl font-semibold text-panel-foreground text-xl+ leading-7">
					{dashboard.cashPositionHeadline}
				</p>

				<p className="text-m text-shell-muted">
					{dashboard.companyName} · {dashboard.dateRangeLabel} · {dashboard.runwayDays} days of runway at current
					payroll and essential spend
				</p>
			</header>

			<section>
				<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
					<div className="min-w-0">
						<ExploreKicker>13-week cash outlook</ExploreKicker>

						<h2 className="mt-1 text-2xl+ text-panel-foreground">
							{dashboard.lowestProjectedCashDate && dashboard.lowestProjectedCashCents !== undefined
								? `Lowest week is ${formatExploreMoney(dashboard.lowestProjectedCashCents)} on ${formatDashboardDate(dashboard.lowestProjectedCashDate)}`
								: "No 13-week outlook for this range"}
						</h2>
					</div>

					<p className="text-m text-shell-muted">
						Buffer {formatExploreMoney(dashboard.cashBufferTargetCents)}
						{belowBuffer ? " · trough is below the buffer" : " · trough stays above the buffer"}
					</p>
				</div>

				<div className="mt-5">
					<CashOutlookChart
						bufferTargetCents={dashboard.cashBufferTargetCents}
						chartData={dashboard.forecastChartData}
						lowestProjectedCashDate={dashboard.lowestProjectedCashDate}
					/>
				</div>
			</section>

			<section className="grid gap-10 border-border border-t pt-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
				<div>
					<ExploreKicker>Outlook weeks</ExploreKicker>

					<h2 className="mt-1 text-l+ text-panel-foreground">Inflow, outflow, and ending cash</h2>

					<ol className="mt-4 divide-y divide-border border-border border-t">
						{presentation.outlookEvents.map(
							({ dateLabel, endingLabel, inflowLabel, isLowest, netDollars, netLabel, outflowLabel, week }) => (
								<li key={week} className="py-3">
									<div className="flex items-start justify-between gap-3">
										<p className="font-semibold text-m+ text-panel-foreground">
											{dateLabel}
											{isLowest ? " · lowest week" : ""}
										</p>

										<p className="font-mono text-m+ tabular-nums">{endingLabel}</p>
									</div>

									<p className="mt-1 text-muted-foreground text-s">
										In {inflowLabel} · Out {outflowLabel} ·{" "}
										{netDollars < 0 ? `Net outflow ${netLabel}` : `Net inflow ${netLabel}`}
									</p>
								</li>
							),
						)}
					</ol>
				</div>

				<div className="min-w-0">
					<ExploreKicker>Levers on this outlook</ExploreKicker>

					<h2 className="mt-1 text-l+ text-panel-foreground">Cash Actions ranked by impact, due date, and urgency</h2>

					{dashboard.actionInbox.length ? (
						<ul className="mt-4 divide-y divide-border border-border border-t">
							{dashboard.actionInbox.map((action) => (
								<li key={action.id} className="py-4">
									<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
										<div className="min-w-0">
											<div className="flex flex-wrap items-center gap-x-3 gap-y-1">
												<PriorityCue priority={action.priority} />

												<span className="text-muted-foreground text-s">{CASH_ACTION_WORK[action.type]}</span>

												<span className="text-muted-foreground text-s">Due {formatDashboardDate(action.dueDate)}</span>
											</div>

											<p className="mt-1 font-semibold text-l+ text-panel-foreground">{action.title}</p>

											<p className="mt-1 text-m text-muted-foreground leading-6">{action.description}</p>

											<p className="mt-1 text-muted-foreground text-s">{action.owner}</p>
										</div>

										<div className="shrink-0 sm:text-right">
											<ExploreMoney cents={action.impactCents} className="text-xl+" exact />

											<ExploreLink
												className="mt-3"
												href={getCashActionDestination(action.type, basePath)}
												primary={action.priority === "critical"}
											>
												{CASH_ACTION_NEXT_STEP[action.type]}
											</ExploreLink>
										</div>
									</div>
								</li>
							))}
						</ul>
					) : (
						<p className="mt-4 text-m text-muted-foreground">No open Cash Actions for this role.</p>
					)}
				</div>
			</section>

			<section className="grid gap-8 border-border border-t pt-8 md:grid-cols-3">
				<div>
					<ExploreKicker>Receivables</ExploreKicker>

					<p className="mt-2">
						<ExploreMoney cents={dashboard.projectedReceivablesCents} className="text-2xl+" />
					</p>

					<p className="mt-1 text-muted-foreground text-s">Upcoming invoices in the current window</p>

					<Link
						className="mt-3 inline-flex min-h-11 items-center text-m text-primary hover:underline"
						href={`${basePath}/invoices`}
					>
						View invoices
					</Link>
				</div>

				<div>
					<ExploreKicker>Outgoing</ExploreKicker>

					<p className="mt-2">
						<ExploreMoney cents={dashboard.projectedOutflowCents} className="text-2xl+" />
					</p>

					<p className="mt-1 text-muted-foreground text-s">Upcoming vendor bills and scheduled outflows</p>

					<Link
						className="mt-3 inline-flex min-h-11 items-center text-m text-primary hover:underline"
						href={`${basePath}/vendors`}
					>
						View vendors
					</Link>
				</div>

				<div>
					<ExploreKicker>Team budgets</ExploreKicker>

					<p className="mt-2">
						<ExploreMoney cents={dashboard.totalCommittedSpendCents} className="text-2xl+" />
					</p>

					<p className="mt-1 text-muted-foreground text-s">Committed across current team guardrails</p>

					<Link
						className="mt-3 inline-flex min-h-11 items-center text-m text-primary hover:underline"
						href={`${basePath}/budgets`}
					>
						View budgets
					</Link>
				</div>
			</section>

			<SupportNoteList notes={presentation.supportNotes} />
		</div>
	);
};
