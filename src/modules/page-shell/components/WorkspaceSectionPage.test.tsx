// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { buildApprovalsPresentation } from "@/modules/dashboard/explore/approvalsModel";
import { buildTeamBudgetsPresentation } from "@/modules/dashboard/explore/teamBudgetsModel";
import { buildDashboardViewModel } from "@/modules/dashboard/view-model";
import { DEMO_WORKSPACE_DATASET } from "@/modules/workspace/demoDataset";
import { WorkspaceSectionPage } from "./WorkspaceSectionPage";

describe("WorkspaceSectionPage", () => {
	it.each([
		["approvals", buildApprovalsPresentation(buildDashboardViewModel({ dataset: DEMO_WORKSPACE_DATASET })).headline],
		["budgets", buildTeamBudgetsPresentation(DEMO_WORKSPACE_DATASET).headline],
	] as const)("uses the glass cockpit instead of the workspace section header on %s", (section, headline) => {
		render(<WorkspaceSectionPage dataset={DEMO_WORKSPACE_DATASET} readOnly section={section} />);

		expect(screen.queryByRole("link", { name: "Run leak audit" })).not.toBeInTheDocument();
		expect(screen.queryByText("Workspace")).not.toBeInTheDocument();
		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(headline);
	});
});
