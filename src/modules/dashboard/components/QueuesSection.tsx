import { AmountItem } from "@/modules/money/components/AmountItem";
import { formatCurrency, formatPreciseCompactCurrency, getPercentage } from "@/modules/money/format";
import { ApprovalQueue } from "@/modules/spend-requests/components/ApprovalQueue";
import { LeakList } from "@/modules/subscriptions/components/LeakList";
import { WORKSPACE_DATASET_QUERY_KEYS } from "@/modules/workspace/query";
import { Badge } from "@/ui/components/data/Badge";
import { ProgressBar } from "@/ui/components/feedback/ProgressBar";
import type { DashboardViewModel } from "../types";
import { DashboardPanel } from "./DashboardPanel";
import { PanelLink } from "./PanelLink";

type QueuesSectionProps = {
	dashboard: DashboardViewModel;
	basePath?: string;
	readOnly?: boolean;
};

export const QueuesSection = ({ basePath = "/dashboard", dashboard, readOnly = false }: QueuesSectionProps) => {
	const overdueInvoices = dashboard.overdueInvoices;
	const vendorLeaks = dashboard.vendorLeaks;
	const recoverableCents =
		overdueInvoices.reduce((totalCents, invoice) => totalCents + invoice.amountCents, 0) +
		vendorLeaks.reduce((totalCents, leak) => totalCents + leak.amountCents, 0);

	return (
		<section className="grid gap-4 xl:grid-cols-3">
			<DashboardPanel label="Approvals" title="Spend requests to decide">
				<ApprovalQueue
					datasetQueryKey={WORKSPACE_DATASET_QUERY_KEYS.all}
					readOnly={readOnly}
					requests={dashboard.pendingApprovals}
				/>

				<PanelLink href={`${basePath}/approvals`}>View all approvals</PanelLink>
			</DashboardPanel>

			<DashboardPanel
				action={
					recoverableCents > 0 && (
						<div className="text-right">
							<p className="font-mono text-l+ text-panel-foreground">
								{formatPreciseCompactCurrency(recoverableCents)}
							</p>

							<p className="text-muted-foreground text-s">To collect or cut</p>
						</div>
					)
				}
				label="Collect and cut"
				title="Overdue invoices and vendor leaks"
			>
				{!overdueInvoices.length && !vendorLeaks.length && (
					<p className="rounded-lg border border-border bg-panel-muted p-3 text-m text-muted-foreground">
						No overdue invoices or vendor leaks need action.
					</p>
				)}

				{overdueInvoices.length > 0 && (
					<ul className="space-y-3">
						{overdueInvoices.map(({ amountCents, client, collectionProbability, id, owner }) => (
							<AmountItem
								key={id}
								amountCents={amountCents}
								meta={
									<span className="flex flex-wrap items-center gap-1.5">
										<Badge variant="warning">Overdue</Badge>

										<span>Owner: {owner}</span>

										<span>Probability {getPercentage(collectionProbability)}</span>
									</span>
								}
								title={client}
							/>
						))}
					</ul>
				)}

				{vendorLeaks.length > 0 && (
					<LeakList className={overdueInvoices.length > 0 ? "mt-3 space-y-3" : "space-y-3"} items={vendorLeaks} />
				)}

				<div className="grid gap-2 sm:grid-cols-2">
					<PanelLink className="mt-6" href={`${basePath}/invoices`}>
						View invoices
					</PanelLink>

					<PanelLink className="mt-6" href={`${basePath}/vendors`}>
						View vendor leaks
					</PanelLink>
				</div>
			</DashboardPanel>

			<DashboardPanel label="Budget guardrails" title="Team limits">
				{dashboard.budgetRows.length ? (
					<ul className="space-y-4">
						{dashboard.budgetRows.map(({ id, remainingCents, team, usagePercent }) => (
							<li key={id}>
								<div className="mb-2 flex items-center justify-between gap-3">
									<p className="min-w-0 font-semibold text-m+ text-panel-foreground">{team}</p>

									<span className="shrink-0 font-mono text-s text-shell-muted">
										{formatCurrency(remainingCents)} {remainingCents >= 0 ? "left" : "over budget"}
									</span>
								</div>

								<ProgressBar
									label={`${team} budget used${remainingCents >= 0 ? "" : " (over budget)"}`}
									value={usagePercent}
								/>
							</li>
						))}
					</ul>
				) : (
					<p className="rounded-lg border border-border bg-panel-muted p-3 text-m text-muted-foreground">
						No team budgets for this range.
					</p>
				)}

				<PanelLink href={`${basePath}/budgets`}>Manage guardrails</PanelLink>
			</DashboardPanel>
		</section>
	);
};
