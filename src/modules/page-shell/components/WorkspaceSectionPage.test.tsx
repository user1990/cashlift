// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { describe, expect, it } from "vitest";
import { buildApprovalsPresentation } from "@/modules/dashboard/explore/approvalsModel";
import { buildTeamBudgetsPresentation } from "@/modules/dashboard/explore/teamBudgetsModel";
import { buildDashboardViewModel } from "@/modules/dashboard/view-model";
import { DEMO_WORKSPACE_DATASET } from "@/modules/workspace/demoDataset";
import { buildVendorsPresentation } from "../vendorsPresentation";
import { WorkspaceSectionPage } from "./WorkspaceSectionPage";

describe("WorkspaceSectionPage", () => {
	it.each([
		{
			headline: buildApprovalsPresentation(buildDashboardViewModel({ dataset: DEMO_WORKSPACE_DATASET })).headline,
			section: "approvals" as const,
		},
		{
			headline: buildTeamBudgetsPresentation(DEMO_WORKSPACE_DATASET).headline,
			section: "budgets" as const,
		},
		{
			headline: "3 company members across Finance, Client Delivery, and Operations",
			section: "team" as const,
		},
		{
			headline: buildVendorsPresentation(DEMO_WORKSPACE_DATASET).headline,
			section: "vendors" as const,
		},
	])("uses the glass cockpit instead of the workspace section header on $section", ({ headline, section }) => {
		render(<WorkspaceSectionPage basePath="/dashboard" dataset={DEMO_WORKSPACE_DATASET} readOnly section={section} />);

		expect(screen.queryByRole("link", { name: "Run leak audit" })).not.toBeInTheDocument();
		expect(screen.queryByText("Workspace")).not.toBeInTheDocument();
		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(headline);
	});

	it("uses the glass cockpit instead of the workspace section header on invoices", () => {
		render(
			<NuqsTestingAdapter hasMemory>
				<WorkspaceSectionPage basePath="/dashboard" dataset={DEMO_WORKSPACE_DATASET} section="invoices" />
			</NuqsTestingAdapter>,
		);

		expect(screen.queryByRole("link", { name: "Run leak audit" })).not.toBeInTheDocument();
		expect(screen.queryByText("Workspace")).not.toBeInTheDocument();
		expect(screen.queryByRole("heading", { name: "Invoice collection" })).not.toBeInTheDocument();
		expect(screen.getByRole("button", { name: /search for anything in this workspace/i })).toBeVisible();
	});
});
