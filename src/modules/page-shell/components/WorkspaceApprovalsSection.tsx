import { SpendRequestApprovalQueue } from "@/modules/spend-requests/components/SpendRequestApprovalQueue";
import type { FinancialDataset } from "@/modules/workspace/types";
import { Panel, PanelHeader } from "@/ui/components/Panel";

type WorkspaceApprovalsSectionProps = {
	dataset: FinancialDataset;
};

export const WorkspaceApprovalsSection = ({ dataset }: WorkspaceApprovalsSectionProps) => {
	const pendingRequests = dataset.spendRequests.filter((request) => request.status === "pending");

	return (
		<div className="grid gap-4 xl:grid-cols-[1fr_0.7fr]">
			<Panel>
				<PanelHeader label="Queue" title={`${pendingRequests.length} requests need review`} />

				<SpendRequestApprovalQueue requests={dataset.spendRequests} />
			</Panel>

			<Panel>
				<PanelHeader label="Rules" title="Approval policy" />

				<div className="space-y-3 text-m leading-6 text-muted-foreground">
					<p>Managers approve team spend after CashLift shows cash impact.</p>

					<p>Finance holds non-essential requests if buffer risk appears.</p>

					<p>Employees can request spend and upload receipts only.</p>
				</div>
			</Panel>
		</div>
	);
};
