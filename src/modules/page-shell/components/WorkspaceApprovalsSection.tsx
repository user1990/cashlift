import { ApprovalQueue } from "@/modules/spend-requests/components/ApprovalQueue";
import { WORKSPACE_DATASET_QUERY_KEYS } from "@/modules/workspace/query";
import type { FinancialDataset } from "@/modules/workspace/types";
import { Panel } from "@/ui/components/layout/Panel";
import { PanelHeader } from "@/ui/components/layout/PanelHeader";

type WorkspaceApprovalsSectionProps = {
	dataset: FinancialDataset;
	readOnly?: boolean;
};

export const WorkspaceApprovalsSection = ({ dataset, readOnly = false }: WorkspaceApprovalsSectionProps) => {
	const pendingRequests = dataset.spendRequests.filter((request) => request.status === "pending");

	return (
		<div className="grid gap-4 xl:grid-cols-[1fr_0.7fr]">
			<Panel>
				<PanelHeader label="Queue" title={`${pendingRequests.length} requests need review`} />

				<ApprovalQueue
					datasetQueryKey={WORKSPACE_DATASET_QUERY_KEYS.all}
					readOnly={readOnly}
					requests={dataset.spendRequests}
				/>
			</Panel>

			<Panel>
				<PanelHeader label="Rules" title="Approval policy" />

				<div className="space-y-3 text-m text-muted-foreground leading-6">
					<p>Managers approve team spend after CashLift shows cash impact.</p>

					<p>Finance holds non-essential requests if buffer risk appears.</p>

					<p>Employees can request spend and upload receipts only.</p>
				</div>
			</Panel>
		</div>
	);
};
