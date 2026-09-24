import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { FinancialDataset, WorkspaceDatasetDateRange } from "@/modules/workspace/types";
import type { WorkspaceExperience, WorkspaceSection } from "../types";
import { getWorkspaceExperienceContract } from "../workspaceExperience";
import { WorkspacePageLoading } from "./WorkspacePageLoading";

const Overview = dynamic(
	() => import("@/modules/dashboard/components/Overview").then((mod) => ({ default: mod.Overview })),
	{ loading: () => <WorkspacePageLoading section="overview" /> },
);

const CashInsights = dynamic(
	() => import("@/modules/dashboard/components/CashInsights").then((mod) => ({ default: mod.CashInsights })),
	{ loading: () => <WorkspacePageLoading section="cash" /> },
);

const WorkspaceApprovalsSection = dynamic(
	() => import("./WorkspaceApprovalsSection").then((mod) => ({ default: mod.WorkspaceApprovalsSection })),
	{ loading: () => <WorkspacePageLoading section="approvals" /> },
);

const WorkspaceBudgetsSection = dynamic(
	() => import("./WorkspaceBudgetsSection").then((mod) => ({ default: mod.WorkspaceBudgetsSection })),
	{ loading: () => <WorkspacePageLoading section="budgets" /> },
);

const WorkspaceInvoicesSection = dynamic(
	() => import("./WorkspaceInvoicesSection").then((mod) => ({ default: mod.WorkspaceInvoicesSection })),
	{ loading: () => <WorkspacePageLoading section="invoices" /> },
);

const WorkspaceSettingsSection = dynamic(
	() => import("./WorkspaceSettingsSection").then((mod) => ({ default: mod.WorkspaceSettingsSection })),
	{ loading: () => <WorkspacePageLoading section="settings" /> },
);

const WorkspaceTeamSection = dynamic(
	() => import("./WorkspaceTeamSection").then((mod) => ({ default: mod.WorkspaceTeamSection })),
	{ loading: () => <WorkspacePageLoading section="team" /> },
);

const WorkspaceVendorsSection = dynamic(
	() => import("./WorkspaceVendorsSection").then((mod) => ({ default: mod.WorkspaceVendorsSection })),
	{ loading: () => <WorkspacePageLoading section="vendors" /> },
);

type WorkspacePageViewProps = {
	dataset: FinancialDataset;
	dateRange?: WorkspaceDatasetDateRange;
	experience: WorkspaceExperience;
	onDateRangeChange?: (dateRange: WorkspaceDatasetDateRange) => void;
	section: WorkspaceSection;
};

type WorkspaceSectionComponentProps = {
	basePath: string;
	dataset: FinancialDataset;
	readOnly?: boolean;
};

const WORKSPACE_SECTION_COMPONENTS: Record<
	Exclude<WorkspaceSection, "overview" | "cash">,
	ComponentType<WorkspaceSectionComponentProps>
> = {
	approvals: WorkspaceApprovalsSection,
	budgets: WorkspaceBudgetsSection,
	invoices: WorkspaceInvoicesSection,
	settings: WorkspaceSettingsSection,
	team: WorkspaceTeamSection,
	vendors: WorkspaceVendorsSection,
};

export const WorkspacePageView = ({
	dataset,
	dateRange,
	experience,
	onDateRangeChange,
	section,
}: WorkspacePageViewProps) => {
	const workspace = getWorkspaceExperienceContract(experience);

	if (section === "overview") {
		return (
			<Overview
				basePath={workspace.basePath}
				dataset={dataset}
				dateRange={dateRange}
				onDateRangeChange={onDateRangeChange}
				readOnly={workspace.readOnly}
			/>
		);
	}

	if (section === "cash") {
		return <CashInsights basePath={workspace.basePath} dataset={dataset} />;
	}

	const SectionComponent = WORKSPACE_SECTION_COMPONENTS[section];

	return <SectionComponent basePath={workspace.basePath} dataset={dataset} readOnly={workspace.readOnly} />;
};
