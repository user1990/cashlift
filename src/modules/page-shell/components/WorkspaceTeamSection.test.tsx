// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { WorkspaceSectionPage } from "./WorkspaceSectionPage";
import { WorkspaceTeamSection } from "./WorkspaceTeamSection";

describe("WorkspaceTeamSection", () => {
	it("renders company members in the overview cockpit layout from the current dataset", () => {
		const [maya, leo, nora] = financialDatasetFixture.teamMembers;

		render(<WorkspaceSectionPage basePath="/dashboard" dataset={financialDatasetFixture} section="team" />);

		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
			"3 company members across Finance, Creative, and Client Strategy",
		);
		expect(screen.getByRole("heading", { name: maya.name })).toBeVisible();
		expect(screen.getByText(`Finance Lead on ${maya.team}`)).toBeVisible();
		expect(screen.getAllByText(leo.name).length).toBeGreaterThan(0);
		expect(screen.getAllByText(nora.name).length).toBeGreaterThan(0);
		expect(screen.getByRole("link", { name: "Open team budgets" })).toHaveAttribute("href", "/dashboard/budgets");
		expect(screen.getByRole("link", { name: "View team budgets" })).toHaveAttribute("href", "/dashboard/budgets");
	});

	it("renders empty and single-team headlines from the supplied members", () => {
		const [maya] = financialDatasetFixture.teamMembers;

		render(
			<WorkspaceTeamSection basePath="/demo/workspace" dataset={{ ...financialDatasetFixture, teamMembers: [] }} />,
		);

		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("No company members in this workspace");
		expect(screen.getByRole("link", { name: "View team budgets" })).toHaveAttribute("href", "/demo/workspace/budgets");

		cleanup();

		render(
			<WorkspaceTeamSection basePath="/demo/workspace" dataset={{ ...financialDatasetFixture, teamMembers: [maya] }} />,
		);

		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(`1 company member on ${maya.team}`);
		expect(screen.getByRole("heading", { name: maya.name })).toBeVisible();
		expect(screen.getByRole("link", { name: "Open team budgets" })).toHaveAttribute("href", "/demo/workspace/budgets");
	});
});
