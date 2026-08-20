import Link from "next/link";
import { getPercentage } from "@/modules/money/format";
import { getCashActionDestination } from "../cashActionDestination";
import { CashOutlookChart } from "../components/CashOutlookChart";
import { formatDashboardDate } from "../overviewDateRangeLabel";
import type { DashboardViewModel } from "../types";
import { CASH_ACTION_NEXT_STEP, CASH_ACTION_WORK, type ExplorePresentation, formatExploreMoney } from "./exploreModel";
import { ExploreKicker, ExploreLink, ExploreMoney, PriorityCue, SupportNoteList } from "./exploreUi";

type CashAction = DashboardViewModel["actionInbox"][number];

type DecisionFirstDashboardProps = {
	basePath: string;
	dashboard: DashboardViewModel;
	presentation: ExplorePresentation;
};

export const DecisionFirstDashboard = ({ basePath, dashboard, presentation }: DecisionFirstDashboardProps) => {
	const primaryAction = presentation.primaryAction;

	return (
		<div className="space-y-8">
			<p className="text-m text-shell-muted">{presentation.cashContextLine}</p>

			{primaryAction ? (
				<FeaturedDecision action={primaryAction} basePath={basePath} />
			) : (
				<p className="rounded-lg border border-border bg-panel p-5 text-m text-muted-foreground">
					You are clear for today. New cash decisions will appear here.
				</p>
			)}

			<section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_18rem]">
				<div className="min-w-0">
					<ExploreKicker>Ranked Cash Actions</ExploreKicker>

					<h2 className="mt-1 text-panel-foreground text-xl+">Everything else that still needs a decision</h2>

					{presentation.remainingActions.length ? (
						<ol className="mt-4 divide-y divide-border border-border border-t">
							{presentation.remainingActions.map((action, index) => (
								<DecisionQueueRow key={action.id} action={action} basePath={basePath} rank={index + 2} />
							))}
						</ol>
					) : (
						<p className="mt-4 text-m text-muted-foreground">No other open Cash Actions for this role.</p>
					)}
				</div>

				<aside className="min-w-0 space-y-6 border-border xl:border-l xl:pl-6">
					<div>
						<ExploreKicker>If you do nothing</ExploreKicker>

						{presentation.inactionLines.length ? (
							<ul className="mt-3 space-y-3">
								{presentation.inactionLines.map((line) => (
									<li key={line} className="text-m text-panel-foreground leading-6">
										{line}
									</li>
								))}
							</ul>
						) : (
							<p className="mt-3 text-m text-muted-foreground leading-6">
								No overdue invoices, vendor leaks, or pending spend requests are open.
							</p>
						)}
					</div>

					<dl className="space-y-4">
						<div>
							<dt className="text-muted-foreground text-s">Cash on hand</dt>

							<dd>
								<ExploreMoney cents={dashboard.cashAvailableCents} className="text-2xl+" />
							</dd>
						</div>

						<div>
							<dt className="text-muted-foreground text-s">Lowest projected cash</dt>

							<dd>
								<ExploreMoney
									cents={dashboard.lowestProjectedCashCents ?? dashboard.cashAvailableCents}
									className="text-2xl+"
									warning={
										dashboard.lowestProjectedCashCents !== undefined &&
										dashboard.lowestProjectedCashCents < dashboard.cashBufferTargetCents
									}
								/>
							</dd>
						</div>

						<div>
							<dt className="text-muted-foreground text-s">Money at risk</dt>

							<dd>
								<ExploreMoney
									cents={dashboard.cashAtRiskCents}
									className="text-2xl+"
									warning={dashboard.cashAtRiskCents > 0}
								/>
							</dd>
						</div>
					</dl>
				</aside>
			</section>

			<section className="grid gap-8 border-border border-t pt-8 lg:grid-cols-2">
				<div className="min-w-0">
					<ExploreKicker>13-week cash outlook</ExploreKicker>

					<h2 className="mt-1 text-l+ text-panel-foreground">
						{dashboard.lowestProjectedCashDate && dashboard.lowestProjectedCashCents !== undefined
							? `Lowest week ${formatExploreMoney(dashboard.lowestProjectedCashCents)} on ${formatDashboardDate(dashboard.lowestProjectedCashDate)}`
							: "No 13-week outlook for this range"}
					</h2>

					<div className="mt-4">
						<CashOutlookChart
							bufferTargetCents={dashboard.cashBufferTargetCents}
							chartData={dashboard.forecastChartData}
							lowestProjectedCashDate={dashboard.lowestProjectedCashDate}
						/>
					</div>
				</div>

				<div className="min-w-0">
					<ExploreKicker>Collect and cut</ExploreKicker>

					<h2 className="mt-1 text-l+ text-panel-foreground">
						{presentation.recoverableCents > 0
							? `${formatExploreMoney(presentation.recoverableCents)} still recoverable`
							: "No overdue invoices or vendor leaks"}
					</h2>

					<CollectCutList basePath={basePath} dashboard={dashboard} />
				</div>
			</section>

			<SupportNoteList notes={presentation.supportNotes} />
		</div>
	);
};

function FeaturedDecision({ action, basePath }: { action: CashAction; basePath: string }) {
	return (
		<section className="rounded-lg border border-border bg-panel p-5 shadow-panel sm:p-6">
			<ExploreKicker>Today’s first Cash Action</ExploreKicker>

			<div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
				<div className="min-w-0">
					<div className="flex flex-wrap items-center gap-x-3 gap-y-1">
						<PriorityCue priority={action.priority} />

						<span className="text-muted-foreground text-s">{CASH_ACTION_WORK[action.type]}</span>

						<span className="text-muted-foreground text-s">Due {formatDashboardDate(action.dueDate)}</span>

						<span className="text-muted-foreground text-s">{action.owner}</span>
					</div>

					<h1 className="mt-3 max-w-3xl font-semibold text-3xl+ text-panel-foreground tracking-normal sm:text-4xl+">
						{action.title}
					</h1>

					<p className="mt-3 max-w-2xl text-m+ text-shell-muted leading-6">{action.description}</p>
				</div>

				<div className="shrink-0 lg:text-right">
					<ExploreMoney cents={action.impactCents} className="text-4xl+ sm:text-5xl+" exact />

					<p className="mt-1 text-muted-foreground text-s">Cash impact</p>

					<ExploreLink className="mt-4 w-full lg:w-auto" href={getCashActionDestination(action.type, basePath)} primary>
						{CASH_ACTION_NEXT_STEP[action.type]}
					</ExploreLink>
				</div>
			</div>
		</section>
	);
}

function DecisionQueueRow({ action, basePath, rank }: { action: CashAction; basePath: string; rank: number }) {
	return (
		<li>
			<Link
				className="grid gap-3 py-4 outline-none transition-colors hover:text-primary focus-visible:ring-[3px] focus-visible:ring-primary/20 sm:grid-cols-[2rem_minmax(0,1fr)_auto] sm:items-start"
				href={getCashActionDestination(action.type, basePath)}
			>
				<span className="font-mono text-muted-foreground text-s">{rank}</span>

				<span className="min-w-0">
					<span className="flex flex-wrap items-center gap-x-3 gap-y-1">
						<PriorityCue priority={action.priority} />

						<span className="text-muted-foreground text-s">{CASH_ACTION_WORK[action.type]}</span>

						<span className="text-muted-foreground text-s">Due {formatDashboardDate(action.dueDate)}</span>
					</span>

					<span className="mt-1 block font-semibold text-l+ text-panel-foreground">{action.title}</span>

					<span className="mt-1 block text-m text-muted-foreground leading-6">{action.description}</span>

					<span className="mt-1 block text-muted-foreground text-s">{action.owner}</span>
				</span>

				<span className="sm:text-right">
					<ExploreMoney cents={action.impactCents} className="text-xl+" exact />

					<span className="mt-1 block text-muted-foreground text-s">{CASH_ACTION_NEXT_STEP[action.type]}</span>
				</span>
			</Link>
		</li>
	);
}

function CollectCutList({ basePath, dashboard }: { basePath: string; dashboard: DashboardViewModel }) {
	if (!dashboard.overdueInvoices.length && !dashboard.vendorLeaks.length) {
		return <p className="mt-4 text-m text-muted-foreground">No overdue invoices or vendor leaks need action.</p>;
	}

	return (
		<ul className="mt-4 divide-y divide-border border-border border-t">
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

						<p className="mt-1 text-muted-foreground text-s">Vendor leak · {getPercentage(usagePercent)} used</p>
					</div>

					<ExploreMoney cents={amountCents} exact />
				</li>
			))}

			<li className="pt-4">
				<Link className="text-m text-primary hover:underline" href={`${basePath}/invoices`}>
					View invoices
				</Link>

				<span className="text-muted-foreground"> · </span>

				<Link className="text-m text-primary hover:underline" href={`${basePath}/vendors`}>
					View vendor leaks
				</Link>
			</li>
		</ul>
	);
}
