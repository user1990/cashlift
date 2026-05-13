import { formatCurrency, percentage } from "@/modules/common/money/format";
import { AmountListItem } from "@/modules/shared/components/AmountListItem";
import { SubscriptionLeakList } from "@/modules/shared/components/SubscriptionLeakList";
import { Panel, PanelHeader } from "@/modules/ui/components/Panel";
import { ProgressBar } from "@/modules/ui/components/ProgressBar";
import type { DashboardViewModel } from "../types";

type DashboardQueuesSectionProps = {
	dashboard: DashboardViewModel;
};

export const DashboardQueuesSection = ({ dashboard }: DashboardQueuesSectionProps) => (
	<section className="grid gap-4 xl:grid-cols-3">
		<Panel>
			<PanelHeader eyebrow="Invoices" title="Collection queue before buffer risk" />

			<ul className="space-y-3">
				{dashboard.overdueInvoices.map(({ amountCents, client, collectionProbability, id, owner }) => (
					<AmountListItem
						key={id}
						amountCents={amountCents}
						meta={`Owner: ${owner} · Probability ${percentage(collectionProbability)}`}
						title={client}
					/>
				))}
			</ul>
		</Panel>

		<Panel>
			<PanelHeader eyebrow="Vendor leaks" title="Renewals to cut first" />

			<SubscriptionLeakList className="space-y-3" items={dashboard.vendorLeaks} />
		</Panel>

		<Panel>
			<PanelHeader eyebrow="Budget guardrails" title="Team limits" />

			<ul className="space-y-4">
				{dashboard.budgetRows.map(({ id, remainingCents, team, usagePercent }) => (
					<li key={id}>
						<div className="mb-2 flex items-center justify-between gap-3">
							<p className="text-m+ text-panel-foreground">{team}</p>

							<span className="font-mono text-s text-muted-foreground">{formatCurrency(remainingCents)} left</span>
						</div>

						<ProgressBar label={`${team} budget used`} value={usagePercent} />
					</li>
				))}
			</ul>
		</Panel>
	</section>
);
