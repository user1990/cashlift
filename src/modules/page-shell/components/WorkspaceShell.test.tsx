// @vitest-environment jsdom

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { describe, expect, it } from "vitest";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { WorkspacePageContent } from "./WorkspacePageContent";
import { WorkspaceShell } from "./WorkspaceShell";

describe("WorkspaceShell", () => {
	it("opens mobile navigation from the header menu button", async () => {
		const user = userEvent.setup();

		render(
			<NuqsTestingAdapter hasMemory>
				<WorkspaceShell experience="public-demo">
					<WorkspacePageContent dataset={financialDatasetFixture} experience="public-demo" section="overview" />
				</WorkspaceShell>
			</NuqsTestingAdapter>,
		);

		expect(screen.queryByRole("navigation", { name: "Workspace navigation" })).not.toBeInTheDocument();

		await user.click(screen.getByRole("button", { name: "Open navigation" }));

		const drawer = screen.getByLabelText("Workspace navigation");

		expect(within(drawer).getByRole("link", { name: "Overdue collections" })).toBeVisible();
		expect(screen.getByLabelText("Studio Nova, Read-only demo")).toBeVisible();
	});
});
