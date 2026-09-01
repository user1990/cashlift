// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { buildTeamBudgetsPresentation } from "@/modules/dashboard/explore/teamBudgetsModel";
import { DEMO_WORKSPACE_DATASET } from "@/modules/workspace/demoDataset";
import { buildVendorsPresentation } from "../vendorsPresentation";
import { WorkspaceSectionPage } from "./WorkspaceSectionPage";

describe("WorkspaceSectionPage", () => {
	it.each([
		{
			headline: buildTeamBudgetsPresentation(DEMO_WORKSPACE_DATASET).headline,
			section: "budgets" as const,
		},
		{
			headline: buildVendorsPresentation(DEMO_WORKSPACE_DATASET).headline,
			section: "vendors" as const,
		},
	])("uses the glass cockpit instead of the workspace section header on $section", ({ headline, section }) => {
		render(<WorkspaceSectionPage dataset={DEMO_WORKSPACE_DATASET} section={section} />);

		expect(screen.queryByRole("link", { name: "Run leak audit" })).not.toBeInTheDocument();
		expect(screen.queryByText("Workspace")).not.toBeInTheDocument();
		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(headline);
	});
});
