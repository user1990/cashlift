"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import type { FinancialDataset } from "@/modules/base/finance/types";
import { Reveal } from "@/modules/ui/components/Reveal";
import { WORKSPACE_NAV_GROUPS } from "./navigation";
import type { WorkspaceNavGroup, WorkspacePageProps, WorkspaceSection, WorkspaceSectionComponent } from "./types";
import { WorkspaceApprovalsSection } from "./WorkspaceApprovalsSection";
import { WorkspaceBudgetsSection } from "./WorkspaceBudgetsSection";
import { WorkspaceCashSection } from "./WorkspaceCashSection";
import { WorkspaceInvoicesSection } from "./WorkspaceInvoicesSection";
import { WorkspaceSectionHeader } from "./WorkspaceSectionHeader";
import { WorkspaceSettingsSection } from "./WorkspaceSettingsSection";
import { WorkspaceSidebar } from "./WorkspaceSidebar";
import { WorkspaceVendorsSection } from "./WorkspaceVendorsSection";

type WorkspaceLayoutProps = WorkspacePageProps & {
	dataset: FinancialDataset;
};

export const WorkspaceLayout = ({ dataset, section }: WorkspaceLayoutProps) => {
	const reducedMotion = useReducedMotion();
	const activeGroupId = getActiveWorkspaceGroupId(section);
	const SectionComponent = getWorkspaceSectionComponent(section);
	const [openGroupIds, setOpenGroupIds] = useState<Set<WorkspaceNavGroup["id"]>>(
		() => new Set(activeGroupId ? [activeGroupId] : []),
	);

	useEffect(() => {
		if (!activeGroupId) {
			return;
		}

		setOpenGroupIds((currentIds) => {
			if (currentIds.has(activeGroupId)) {
				return currentIds;
			}

			const nextIds = new Set(currentIds);
			nextIds.add(activeGroupId);

			return nextIds;
		});
	}, [activeGroupId]);

	const toggleGroup = (groupId: WorkspaceNavGroup["id"]) =>
		setOpenGroupIds((currentIds) => {
			const nextIds = new Set(currentIds);

			if (nextIds.has(groupId)) {
				nextIds.delete(groupId);
			} else {
				nextIds.add(groupId);
			}

			return nextIds;
		});

	return (
		<main className="min-h-screen bg-shell text-shell-foreground">
			<div className="mx-auto grid w-full max-w-[1440px] gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
				<WorkspaceSidebar
					activeGroupId={activeGroupId}
					companyName={dataset.profile.name}
					openGroupIds={openGroupIds}
					reducedMotion={reducedMotion}
					section={section}
					toggleGroup={toggleGroup}
				/>

				<section className="space-y-5">
					<WorkspaceSectionHeader section={section} />

					<Reveal duration={0.18} y={8}>
						<SectionComponent dataset={dataset} />
					</Reveal>
				</section>
			</div>
		</main>
	);
};

const WORKSPACE_SECTION_COMPONENTS = {
	approvals: WorkspaceApprovalsSection,
	budgets: WorkspaceBudgetsSection,
	cash: WorkspaceCashSection,
	invoices: WorkspaceInvoicesSection,
	settings: WorkspaceSettingsSection,
	vendors: WorkspaceVendorsSection,
} satisfies Record<WorkspaceSection, WorkspaceSectionComponent>;

function getWorkspaceSectionComponent(section: WorkspaceSection) {
	return WORKSPACE_SECTION_COMPONENTS[section];
}

function getActiveWorkspaceGroupId(section: WorkspaceSection) {
	return WORKSPACE_NAV_GROUPS.find((group) => group.items.some((item) => item.section === section))?.id;
}
