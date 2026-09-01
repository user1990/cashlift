import { CashInsights } from "@/modules/dashboard/components/CashInsights";
import type { FinancialDataset } from "@/modules/workspace/types";
import type { WorkspaceSection } from "../types";
import { WorkspaceApprovalsSection } from "./WorkspaceApprovalsSection";
import { WorkspaceBudgetsSection } from "./WorkspaceBudgetsSection";
import { WorkspaceInvoicesSection } from "./WorkspaceInvoicesSection";
import { WorkspaceSectionHeader } from "./WorkspaceSectionHeader";
import { WorkspaceSettingsSection } from "./WorkspaceSettingsSection";
import { WorkspaceTeamSection } from "./WorkspaceTeamSection";
import { WorkspaceVendorsSection } from "./WorkspaceVendorsSection";

type WorkspaceSectionPageProps = {
	dataset: FinancialDataset;
	section: Exclude<WorkspaceSection, "overview">;
	basePath?: string;
	readOnly?: boolean;
};

export const WorkspaceSectionPage = ({
	basePath = "/dashboard",
	dataset,
	readOnly = false,
	section,
}: WorkspaceSectionPageProps) => {
	if (section === "cash") {
		return <CashInsights basePath={basePath} dataset={dataset} />;
	}

	return (
		<>
			{section !== "budgets" && <WorkspaceSectionHeader section={section} />}

			<WorkspaceSectionContent dataset={dataset} readOnly={readOnly} section={section} />
		</>
	);
};

function WorkspaceSectionContent({
	dataset,
	readOnly,
	section,
}: {
	dataset: FinancialDataset;
	section: Exclude<WorkspaceSection, "cash" | "overview">;
	readOnly?: boolean;
}) {
	switch (section) {
		case "approvals":
			return <WorkspaceApprovalsSection dataset={dataset} readOnly={readOnly} />;
		case "budgets":
			return <WorkspaceBudgetsSection dataset={dataset} />;
		case "invoices":
			return <WorkspaceInvoicesSection dataset={dataset} />;
		case "settings":
			return <WorkspaceSettingsSection dataset={dataset} />;
		case "team":
			return <WorkspaceTeamSection dataset={dataset} />;
		case "vendors":
			return <WorkspaceVendorsSection dataset={dataset} />;
	}
}
