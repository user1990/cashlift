import { FileText } from "lucide-react";
import { formatCurrency, getPercentage } from "@/modules/money/format";
import { ApprovalQueue } from "@/modules/spend-requests/components/ApprovalQueue";
import { LeakList } from "@/modules/subscriptions/components/LeakList";
import { workspaceDatasetQueryKeys } from "@/modules/workspace/query";
import { Badge } from "@/ui/components/Badge";
import { ProgressBar } from "@/ui/components/ProgressBar";
import type { DashboardViewModel } from "../types";
import { DashboardPanel } from "./DashboardPanel";
import { PanelLink } from "./PanelLink";
import { QueueRow } from "./QueueRow";

type QueuesSectionProps = {
	dashboard: DashboardViewModel;
	basePath?: string;
	readOnly?: boolean;
};

export const QueuesSection = ({ basePath = "/dashboard", dashboard, readOnly }: QueuesSectionProps) => (
	<section className="grid gap-4 xl:grid-cols-4">
		<DashboardPanel className="min-h-88 p-5" label="Approvals" title="Spend requests to decide">
			<ApprovalQueue
				datasetQueryKey={workspaceDatasetQueryKeys.all}
				readOnly={readOnly}
				requests={dashboard.pendingApprovals}
			/>

			<PanelLink href={`${basePath}/approvals`}>View all approvals</PanelLink>
		</DashboardPanel>

		<DashboardPanel className="min-h-88 p-5" label="Invoices" title="Collection queue before buffer risk">
			<ul className="space-y-3">
				{dashboard.overdueInvoices.slice(0, 1).map(({ amountCents, client, collectionProbability, id, owner }) => (
					<QueueRow
						key={id}
						icon={
							<span className="grid size-10 place-items-center rounded-full bg-primary-muted text-primary">
								<FileText aria-hidden className="size-5" />
							</span>
						}
						meta={
							<span className="flex flex-wrap items-center gap-1.5">
								<Badge variant="warning">Overdue</Badge>

								<span>Owner: {owner}</span>

								<span>Probability {getPercentage(collectionProbability)}</span>
							</span>
						}
						title={client}
						value={formatCurrency(amountCents)}
						variant="primary"
					/>
				))}
			</ul>

			<PanelLink href={`${basePath}/invoices`}>View all invoices</PanelLink>
		</DashboardPanel>

		<DashboardPanel className="min-h-88 p-5" label="Vendor leaks" title="Renewals to cut first">
			<LeakList items={dashboard.vendorLeaks.slice(0, 2)} className="space-y-3" />

			<PanelLink href={`${basePath}/vendors`}>View all vendor leaks</PanelLink>
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

			<PanelLink href={`${basePath}/budgets`}>Manage guardrails</PanelLink>
		</DashboardPanel>
	</section>
);
