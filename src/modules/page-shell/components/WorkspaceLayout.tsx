"use client";

import { useReducedMotion } from "motion/react";
import { DashboardContent } from "@/modules/dashboard/components/DashboardContent";
import type { FinancialDataset } from "@/modules/workspace/types";
import { Reveal } from "@/ui/components/Reveal";
import type { WorkspaceMode, WorkspacePageProps, WorkspaceSection, WorkspaceSectionComponent } from "./types";
import { WorkspaceApprovalsSection } from "./WorkspaceApprovalsSection";
import { WorkspaceBudgetsSection } from "./WorkspaceBudgetsSection";
import { WorkspaceCashSection } from "./WorkspaceCashSection";
import { WorkspaceInvoicesSection } from "./WorkspaceInvoicesSection";
import { WorkspaceSectionHeader } from "./WorkspaceSectionHeader";
import { WorkspaceSettingsSection } from "./WorkspaceSettingsSection";
import { WorkspaceSidebar } from "./WorkspaceSidebar";
import { WorkspaceTeamSection } from "./WorkspaceTeamSection";
import { WorkspaceVendorsSection } from "./WorkspaceVendorsSection";

type WorkspaceLayoutProps = WorkspacePageProps & {
	dataset: FinancialDataset;
	mode: WorkspaceMode;
};

export const WorkspaceLayout = ({ dataset, mode, section }: WorkspaceLayoutProps) => {
	const reducedMotion = useReducedMotion();
	const SectionComponent = getWorkspaceSectionComponent(section);
	const overview = section === "overview";

	return (
		<main id="main-content" className="min-h-screen bg-shell text-shell-foreground">
			<div className="mx-auto grid w-full max-w-[1600px] gap-6 p-4 lg:grid-cols-[236px_1fr]">
				<WorkspaceSidebar mode={mode} reducedMotion={reducedMotion} section={section} />

				<section className="min-w-0 space-y-5">
					{overview ? <SectionComponent dataset={dataset} /> : <WorkspaceSubpage section={section} dataset={dataset} />}
				</section>
			</div>
		</main>
	);
};

type WorkspaceSubpageProps = {
	dataset: FinancialDataset;
	section: Exclude<WorkspaceSection, "overview">;
};

const WorkspaceSubpage = ({ dataset, section }: WorkspaceSubpageProps) => {
	const SectionComponent = getWorkspaceSectionComponent(section);

	return (
		<>
			<WorkspaceSectionHeader section={section} />

			<Reveal duration={0.18} y={8}>
				<SectionComponent dataset={dataset} />
			</Reveal>
		</>
	);
};

const WORKSPACE_SECTION_COMPONENTS = {
	approvals: WorkspaceApprovalsSection,
	budgets: WorkspaceBudgetsSection,
	cash: WorkspaceCashSection,
	invoices: WorkspaceInvoicesSection,
	overview: DashboardContent,
	settings: WorkspaceSettingsSection,
	team: WorkspaceTeamSection,
	vendors: WorkspaceVendorsSection,
} as const satisfies Record<WorkspaceSection, WorkspaceSectionComponent>;

function getWorkspaceSectionComponent(section: WorkspaceSection) {
	return WORKSPACE_SECTION_COMPONENTS[section];
}
