import { FileText } from "lucide-react";
import { formatCurrency, percentage } from "@/modules/money/format";
import { SubscriptionLeakList } from "@/modules/subscriptions/components/SubscriptionLeakList";
import { ProgressBar } from "@/ui/components/ProgressBar";
import type { DashboardViewModel } from "../types";
import { DashboardListRow } from "./DashboardListRow";
import { DashboardPanel } from "./DashboardPanel";
import { DashboardPanelLink } from "./DashboardPanelLink";

type DashboardQueuesSectionProps = {
	dashboard: DashboardViewModel;
};

export const DashboardQueuesSection = ({ dashboard }: DashboardQueuesSectionProps) => (
	<section className="grid gap-4 xl:grid-cols-3">
		<DashboardPanel className="min-h-88 p-5" label="Invoices" title="Collection queue before buffer risk">
			<ul className="space-y-3">
				{dashboard.overdueInvoices.slice(0, 1).map(({ amountCents, client, collectionProbability, id, owner }) => (
					<DashboardListRow
						key={id}
						icon={
							<span className="grid size-10 place-items-center rounded-full bg-primary-muted text-primary">
								<FileText aria-hidden className="size-5" />
							</span>
						}
						meta={`Owner: ${owner} • Probability ${percentage(collectionProbability)}`}
						title={client}
						value={formatCurrency(amountCents)}
						variant="primary"
					/>
				))}
			</ul>

			<DashboardPanelLink href="/dashboard/invoices">View all invoices</DashboardPanelLink>
		</DashboardPanel>

		<DashboardPanel className="min-h-88 p-5" label="Vendor leaks" title="Renewals to cut first">
			<SubscriptionLeakList items={dashboard.vendorLeaks.slice(0, 2)} className="space-y-3" />

			<DashboardPanelLink href="/dashboard/vendors">View all vendor leaks</DashboardPanelLink>
		</DashboardPanel>

		<DashboardPanel className="min-h-88 p-5" label="Budget guardrails" title="Team limits">
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

			<DashboardPanelLink href="/dashboard/budgets">Manage guardrails</DashboardPanelLink>
		</DashboardPanel>
	</section>
);
