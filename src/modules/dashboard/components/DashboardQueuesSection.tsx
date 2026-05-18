import { ArrowRight, FileText } from "lucide-react";
import Link from "next/link";
import { formatCurrency, percentage } from "@/modules/money/format";
import { SubscriptionLeakList } from "@/modules/subscriptions/components/SubscriptionLeakList";
import { Panel, PanelHeader } from "@/ui/components/Panel";
import { ProgressBar } from "@/ui/components/ProgressBar";
import type { DashboardViewModel } from "../types";

type DashboardQueuesSectionProps = {
	dashboard: DashboardViewModel;
};

export const DashboardQueuesSection = ({ dashboard }: DashboardQueuesSectionProps) => (
	<section className="grid gap-4 xl:grid-cols-3">
		<Panel className="min-h-[348px] p-5">
			<PanelHeader eyebrow="Invoices" title="Collection queue before buffer risk" />

			<ul className="space-y-3">
				{dashboard.overdueInvoices.slice(0, 1).map(({ amountCents, client, collectionProbability, id, owner }) => (
					<li key={id} className="rounded-lg border border-primary-muted/80 bg-primary-subtle p-4">
						<div className="flex items-center justify-between gap-3">
							<div className="flex items-center gap-3">
								<span className="grid size-10 place-items-center rounded-full bg-primary-muted text-primary">
									<FileText aria-hidden className="size-5" />
								</span>

								<div>
									<p className="text-m+ font-semibold text-panel-foreground">{client}</p>

									<p className="mt-1 text-s text-shell-muted">
										Owner: {owner} • Probability {percentage(collectionProbability)}
									</p>
								</div>
							</div>

							<span className="font-mono text-m+ text-primary">{formatCurrency(amountCents)}</span>
						</div>
					</li>
				))}
			</ul>

			<DashboardPanelLink href="/app/invoices">View all invoices</DashboardPanelLink>
		</Panel>

		<Panel className="min-h-[348px] p-5">
			<PanelHeader eyebrow="Vendor leaks" title="Renewals to cut first" />

			<SubscriptionLeakList className="space-y-3" items={dashboard.vendorLeaks.slice(0, 2)} />

			<DashboardPanelLink href="/app/vendors">View all vendor leaks</DashboardPanelLink>
		</Panel>

		<Panel className="min-h-[348px] p-5">
			<PanelHeader eyebrow="Budget guardrails" title="Team limits" />

			<ul className="space-y-4">
				{dashboard.budgetRows.slice(0, 3).map(({ id, remainingCents, team, usagePercent }) => (
					<li key={id}>
						<div className="mb-2 flex items-center justify-between gap-3">
							<p className="text-m+ font-semibold text-panel-foreground">{team}</p>

							<span className="font-mono text-s text-shell-muted">{formatCurrency(remainingCents)} left</span>
						</div>

						<ProgressBar label={`${team} budget used`} value={usagePercent} />
					</li>
				))}
			</ul>

			<DashboardPanelLink href="/app/budgets">Manage guardrails</DashboardPanelLink>
		</Panel>
	</section>
);

type DashboardPanelLinkProps = {
	children: React.ReactNode;
	href: string;
};

const DashboardPanelLink = ({ children, href }: DashboardPanelLinkProps) => (
	<Link
		className="mt-6 flex h-11 items-center justify-between rounded-lg bg-panel-muted px-4 text-m font-semibold text-panel-foreground transition-colors duration-150 ease hover:bg-primary-subtle hover:text-primary"
		href={href}
	>
		{children}

		<ArrowRight aria-hidden className="size-4" />
	</Link>
);
