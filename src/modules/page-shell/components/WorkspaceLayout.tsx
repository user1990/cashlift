"use client";

import { DashboardContent } from "@/modules/dashboard/components/DashboardContent";
import type { FinancialDataset } from "@/modules/workspace/types";
import { MainContent } from "./MainContent";
import type { WorkspaceMode, WorkspacePageProps } from "./types";
import { WorkspaceSidebar } from "./WorkspaceSidebar";
import { WorkspaceSubpage } from "./WorkspaceSubpage";

type WorkspaceLayoutProps = WorkspacePageProps & {
	dataset: FinancialDataset;
	mode: WorkspaceMode;
};

export const WorkspaceLayout = ({ dataset, mode, section }: WorkspaceLayoutProps) => {
	const overview = section === "overview";

	return (
		<MainContent variant="workspace">
			<div className="mx-auto grid w-full max-w-[1600px] gap-6 p-4 lg:grid-cols-[236px_1fr]">
				<WorkspaceSidebar mode={mode} section={section} />

				<section className="min-w-0 space-y-5">
					{overview ? <DashboardContent dataset={dataset} /> : <WorkspaceSubpage section={section} dataset={dataset} />}
				</section>
			</div>
		</MainContent>
	);
};
