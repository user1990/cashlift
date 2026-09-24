// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { describe, expect, it, vi } from "vitest";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { WorkspacePageQueryContent } from "./WorkspacePageQueryContent";

const USE_WORKSPACE_DATASET_QUERY = vi.hoisted(() => vi.fn());

vi.mock("@/modules/workspace/query", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/modules/workspace/query")>();

	return {
		...actual,
		useWorkspaceDatasetQuery: USE_WORKSPACE_DATASET_QUERY,
		workspaceDatasetMatchesInitialRange: () => false,
	};
});

describe("WorkspacePageQueryContent", () => {
	it("renders refresh error when the range query fails without seeded data", () => {
		USE_WORKSPACE_DATASET_QUERY.mockReturnValue({
			data: undefined,
			error: new Error("Unable to load workspace data."),
			isFetching: false,
			refetch: vi.fn(),
		});

		render(
			<NuqsTestingAdapter hasMemory>
				<WorkspacePageQueryContent dataset={financialDatasetFixture} experience="production" section="overview" />
			</NuqsTestingAdapter>,
		);

		expect(screen.getByRole("alert")).toBeInTheDocument();
		expect(screen.getByText("Workspace refresh failed")).toBeInTheDocument();
		expect(screen.getByText("Unable to load workspace data.")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Retry refresh" })).toBeInTheDocument();
	});
});
