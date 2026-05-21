"use client";

import { Overview } from "@/modules/dashboard/components/Overview";
import type { FinancialDataset } from "@/modules/workspace/types";
import { MainContent } from "./MainContent";
import type { WorkspaceMode, WorkspacePageProps } from "./types";
import { WorkspaceSectionPage } from "./WorkspaceSectionPage";
import { WorkspaceSidebar } from "./WorkspaceSidebar";

type WorkspaceShellProps = WorkspacePageProps & {
	dataset: FinancialDataset;
	mode: WorkspaceMode;
};

export const WorkspaceShell = ({ dataset, mode, section }: WorkspaceShellProps) => {
	const overview = section === "overview";

	return (
		<MainContent variant="workspace">
			<div className="mx-auto grid w-full max-w-[1600px] gap-6 p-4 lg:grid-cols-[236px_1fr]">
				<WorkspaceSidebar mode={mode} section={section} />

				<section className="min-w-0 space-y-5">
					{overview ? <Overview dataset={dataset} /> : <WorkspaceSectionPage section={section} dataset={dataset} />}
				</section>
			</div>
		</MainContent>
	);
};
