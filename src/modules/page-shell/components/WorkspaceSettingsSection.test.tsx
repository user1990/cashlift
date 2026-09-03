// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { formatPreciseCompactCurrency } from "@/modules/money/format";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { WorkspaceSectionPage } from "./WorkspaceSectionPage";
import { WorkspaceSettingsSection } from "./WorkspaceSettingsSection";

describe("WorkspaceSettingsSection", () => {
	it("renders the glass settings cockpit from the current company profile", () => {
		const [maya, leo, nora] = financialDatasetFixture.teamMembers;
		const { cashBalanceCents, cashBufferTargetCents, companyId, monthlyPayrollCents, name } =
			financialDatasetFixture.profile;

		render(<WorkspaceSectionPage basePath="/dashboard" dataset={financialDatasetFixture} section="settings" />);

		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
			"Studio Nova is an agency workspace with 3 company members",
		);
		expect(screen.getByRole("heading", { level: 2, name })).toBeVisible();
		expect(screen.getAllByText(companyId).length).toBeGreaterThan(0);
		expect(screen.getByText(formatPreciseCompactCurrency(cashBalanceCents))).toBeVisible();
		expect(screen.getAllByText(formatPreciseCompactCurrency(cashBufferTargetCents)).length).toBeGreaterThan(0);
		expect(screen.getAllByText(formatPreciseCompactCurrency(monthlyPayrollCents)).length).toBeGreaterThan(0);
		expect(screen.getByText(maya.name)).toBeVisible();
		expect(screen.getAllByText(leo.name).length).toBeGreaterThan(0);
		expect(screen.getAllByText(nora.name).length).toBeGreaterThan(0);
		expect(screen.getByText("Off")).toBeVisible();
		expect(screen.getByText("Company records")).toBeVisible();
		expect(screen.queryByText("QuickBooks, Xero, bank feed")).not.toBeInTheDocument();
		expect(screen.getByRole("link", { name: "Open team" })).toHaveAttribute("href", "/dashboard/team");
		expect(screen.getByRole("link", { name: "Open cash insights" })).toHaveAttribute("href", "/dashboard/cash");
		expect(screen.getByRole("link", { name: "View team budgets" })).toHaveAttribute("href", "/dashboard/budgets");
		expect(screen.queryByRole("link", { name: "Run leak audit" })).not.toBeInTheDocument();
	});

	it("labels the public demo source and empty member records from the supplied workspace", () => {
		render(<WorkspaceSettingsSection basePath="/demo/workspace" dataset={financialDatasetFixture} readOnly />);

		expect(screen.getByText("Studio Nova · Settings · Public demo")).toBeVisible();
		expect(screen.getByText("Public demo fixtures")).toBeVisible();
		expect(screen.getByText("QuickBooks, Xero, bank feed")).toBeVisible();
		expect(screen.getByRole("link", { name: "Open team" })).toHaveAttribute("href", "/demo/workspace/team");

		cleanup();

		render(
			<WorkspaceSettingsSection
				basePath="/demo/workspace"
				dataset={{ ...financialDatasetFixture, teamMembers: [] }}
				readOnly
			/>,
		);

		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Studio Nova is an agency workspace");
		expect(screen.queryByRole("link", { name: "Open team" })).not.toBeInTheDocument();
		expect(screen.getByRole("link", { name: "Open cash insights" })).toHaveAttribute("href", "/demo/workspace/cash");
	});
});
