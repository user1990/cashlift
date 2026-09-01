// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { buildTeamBudgetsPresentation } from "@/modules/dashboard/explore/teamBudgetsModel";
import { DEMO_WORKSPACE_DATASET } from "@/modules/workspace/demoDataset";
import { WorkspaceSectionPage } from "./WorkspaceSectionPage";

describe("WorkspaceSectionPage", () => {
	it("uses the glass cockpit instead of the workspace section header on team budgets", () => {
		const presentation = buildTeamBudgetsPresentation(DEMO_WORKSPACE_DATASET);

		render(<WorkspaceSectionPage basePath="/dashboard" dataset={DEMO_WORKSPACE_DATASET} section="budgets" />);

		expect(screen.queryByRole("link", { name: "Run leak audit" })).not.toBeInTheDocument();
		expect(screen.queryByText("Workspace")).not.toBeInTheDocument();
		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(presentation.headline);
	});
});
