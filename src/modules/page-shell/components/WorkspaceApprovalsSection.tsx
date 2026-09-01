import { ApprovalsCockpit } from "@/modules/dashboard/explore/ApprovalsCockpit";
import type { FinancialDataset } from "@/modules/workspace/types";

type WorkspaceApprovalsSectionProps = {
	dataset: FinancialDataset;
	readOnly?: boolean;
};

export const WorkspaceApprovalsSection = ({ dataset, readOnly = false }: WorkspaceApprovalsSectionProps) => (
	<ApprovalsCockpit dataset={dataset} readOnly={readOnly} />
);
