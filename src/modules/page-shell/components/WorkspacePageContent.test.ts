import { describe, expect, it } from "vitest";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { getWorkspacePageQueryKey } from "./workspacePageQueryKey";

describe("WorkspacePageContent", () => {
	it("keys overview query content by the effective date range", () => {
		expect(
			getWorkspacePageQueryKey({
				dataset: financialDatasetFixture,
				initialDateRange: { endDate: "2026-05-20", startDate: "2026-05-10" },
				section: "overview",
			}),
		).toEqual("2026-05-10:2026-05-20");

		expect(
			getWorkspacePageQueryKey({
				dataset: financialDatasetFixture,
				initialDateRange: { endDate: "2026-06-17", startDate: "2026-05-06" },
				section: "overview",
			}),
		).toEqual("2026-05-06:2026-06-17");
	});

	it("uses the dataset default range when the URL has no range", () => {
		expect(
			getWorkspacePageQueryKey({
				dataset: financialDatasetFixture,
				section: "overview",
			}),
		).toEqual("2026-05-06:2026-06-17");
	});
});
