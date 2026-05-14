import type { FinancialDataset } from "@/modules/base/finance/types";
import { formatCurrency } from "@/modules/common/money/format";
import { Panel, PanelHeader } from "@/modules/ui/components/Panel";

type WorkspaceApprovalsSectionProps = {
	dataset: FinancialDataset;
};

export const WorkspaceApprovalsSection = ({ dataset }: WorkspaceApprovalsSectionProps) => {
	const pendingRequests = dataset.spendRequests.filter((request) => request.status === "pending");

	return (
		<div className="grid gap-4 xl:grid-cols-[1fr_0.7fr]">
			<Panel>
				<PanelHeader eyebrow="Queue" title={`${pendingRequests.length} requests need review`} />

				<ul className="space-y-3">
					{pendingRequests.map(({ amountCents, id, reason, requester, status, team, vendor }) => (
						<li key={id} className="rounded-lg border border-border bg-panel-muted p-3">
							<div className="flex items-start justify-between gap-3">
								<div>
									<p className="text-m+ text-panel-foreground">{vendor}</p>

									<p className="mt-1 text-s text-muted-foreground">
										{requester} · {team} · {status}
									</p>
								</div>

								<span className="font-mono text-m+">{formatCurrency(amountCents)}</span>
							</div>

							<p className="mt-3 text-s leading-5 text-muted-foreground">{reason}</p>
						</li>
					))}
				</ul>
			</Panel>

			<Panel>
				<PanelHeader eyebrow="Rules" title="Approval policy" />

				<div className="space-y-3 text-m leading-6 text-muted-foreground">
					<p>Managers approve team spend after CashLift shows cash impact.</p>

					<p>Finance holds non-essential requests if buffer risk appears.</p>

					<p>Employees can request spend and upload receipts only.</p>
				</div>
			</Panel>
		</div>
	);
};
