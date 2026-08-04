// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { WorkspacePage } from "./WorkspacePage";
import { WorkspacePageContent } from "./WorkspacePageContent";

const LOAD_WORKSPACE_DATASET_MOCK = vi.hoisted(() => vi.fn());

vi.mock("@/modules/workspace/server", () => ({
	loadWorkspaceDataset: LOAD_WORKSPACE_DATASET_MOCK,
}));

describe("WorkspacePage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it.each([
		["unauthenticated", "Sign in required", "Sign in to load workspace data."],
		["forbidden", "No company workspace", "No company workspace is assigned to this user."],
		["unavailable", "Workspace data unavailable", "Unable to load workspace data."],
	] as const)("renders the %s workspace state", async (status, title, message) => {
		LOAD_WORKSPACE_DATASET_MOCK.mockResolvedValue({ message, status });

		render(await WorkspacePage({ section: "approvals" }));

		expect(LOAD_WORKSPACE_DATASET_MOCK).toHaveBeenCalledWith("approvals");
		expect(screen.getByText(title)).toBeInTheDocument();
		expect(screen.getByText(message)).toBeInTheDocument();
	});

	it("renders scoped data as a read-only public-demo experience", () => {
		render(
			<NuqsTestingAdapter hasMemory>
				<WorkspacePageContent dataset={financialDatasetFixture} experience="public-demo" section="approvals" />
			</NuqsTestingAdapter>,
		);

		expect(screen.getByRole("heading", { name: "Spend approvals" })).toBeInTheDocument();
		expect(screen.getByText("BrandForge")).toBeInTheDocument();
		expect(screen.queryByRole("button", { name: /approve/i })).not.toBeInTheDocument();
	});
});
