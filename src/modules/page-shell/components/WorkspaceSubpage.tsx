import type { FinancialDataset } from "@/modules/workspace/types";
import type { WorkspaceSection, WorkspaceSectionComponent } from "./types";
import { WorkspaceApprovalsSection } from "./WorkspaceApprovalsSection";
import { WorkspaceBudgetsSection } from "./WorkspaceBudgetsSection";
import { WorkspaceCashSection } from "./WorkspaceCashSection";
import { WorkspaceInvoicesSection } from "./WorkspaceInvoicesSection";
import { WorkspaceSectionHeader } from "./WorkspaceSectionHeader";
import { WorkspaceSettingsSection } from "./WorkspaceSettingsSection";
import { WorkspaceTeamSection } from "./WorkspaceTeamSection";
import { WorkspaceVendorsSection } from "./WorkspaceVendorsSection";

type WorkspaceSubpageProps = {
	dataset: FinancialDataset;
	section: Exclude<WorkspaceSection, "overview">;
};

export const WorkspaceSubpage = ({ dataset, section }: WorkspaceSubpageProps) => {
	const SectionComponent = getWorkspaceSectionComponent(section);

	return (
		<>
			<WorkspaceSectionHeader section={section} />

			<SectionComponent dataset={dataset} />
		</>
	);
};

const WORKSPACE_SUBPAGE_COMPONENTS = {
	approvals: WorkspaceApprovalsSection,
	budgets: WorkspaceBudgetsSection,
	cash: WorkspaceCashSection,
	invoices: WorkspaceInvoicesSection,
	settings: WorkspaceSettingsSection,
	team: WorkspaceTeamSection,
	vendors: WorkspaceVendorsSection,
} as const satisfies Record<Exclude<WorkspaceSection, "overview">, WorkspaceSectionComponent>;

function getWorkspaceSectionComponent(section: Exclude<WorkspaceSection, "overview">) {
	return WORKSPACE_SUBPAGE_COMPONENTS[section];
}
