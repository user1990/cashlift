// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { formatPreciseCompactCurrency } from "@/modules/money/format";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { WorkspaceSectionPage } from "./WorkspaceSectionPage";
import { WorkspaceSettingsSection } from "./WorkspaceSettingsSection";

describe("WorkspaceSettingsSection", () => {
	it("renders cash, members, and related workspace links from the current company profile", () => {
		const [maya, leo, nora] = financialDatasetFixture.teamMembers;
		const { cashBalanceCents, cashBufferTargetCents, companyId, monthlyPayrollCents, name } =
			financialDatasetFixture.profile;

		render(<WorkspaceSectionPage basePath="/dashboard" dataset={financialDatasetFixture} section="settings" />);

		expect(screen.getByRole("heading", { level: 2, name })).toBeVisible();
		expect(screen.getAllByText(companyId).length).toBeGreaterThan(0);
		expect(screen.getByText(formatPreciseCompactCurrency(cashBalanceCents))).toBeVisible();
		expect(screen.getAllByText(formatPreciseCompactCurrency(cashBufferTargetCents)).length).toBeGreaterThan(0);
		expect(screen.getAllByText(formatPreciseCompactCurrency(monthlyPayrollCents)).length).toBeGreaterThan(0);
		expect(screen.getByText(maya.name)).toBeVisible();
		expect(screen.getAllByText(leo.name).length).toBeGreaterThan(0);
		expect(screen.getAllByText(nora.name).length).toBeGreaterThan(0);
		expect(screen.getAllByRole("link").map((link) => link.getAttribute("href"))).toEqual([
			"/dashboard/team",
			"/dashboard/cash",
			"/dashboard/budgets",
			"/dashboard",
		]);
	});

	it("uses demo workspace hrefs and hides the team link when no members remain", () => {
		render(<WorkspaceSettingsSection basePath="/demo/workspace" dataset={financialDatasetFixture} readOnly />);

		expect(screen.getAllByRole("link").map((link) => link.getAttribute("href"))).toEqual([
			"/demo/workspace/team",
			"/demo/workspace/cash",
			"/demo/workspace/budgets",
			"/demo/workspace",
		]);

		cleanup();

		render(
			<WorkspaceSettingsSection
				basePath="/demo/workspace"
				dataset={{ ...financialDatasetFixture, teamMembers: [] }}
				readOnly
			/>,
		);

		expect(screen.getAllByRole("link").map((link) => link.getAttribute("href"))).toEqual([
			"/demo/workspace/cash",
			"/demo/workspace/budgets",
			"/demo/workspace",
		]);
	});
});
