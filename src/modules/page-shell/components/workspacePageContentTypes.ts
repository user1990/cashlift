import type { FinancialDataset } from "@/modules/workspace/types";
import type { WorkspaceExperience, WorkspaceSection } from "./types";

export type WorkspacePageRendererProps = {
	dataset: FinancialDataset;
	experience: WorkspaceExperience;
	section: WorkspaceSection;
};
