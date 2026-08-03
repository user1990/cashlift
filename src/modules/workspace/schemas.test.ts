import { describe, expect, it } from "vitest";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { FINANCIAL_DATASET_SCHEMA, WORKSPACE_DATASET_DATE_RANGE_SCHEMA } from "./schemas";

describe("workspace schemas", () => {
	it("accepts the public financial dataset contract", () => {
		expect(FINANCIAL_DATASET_SCHEMA.parse(financialDatasetFixture)).toEqual(financialDatasetFixture);
	});

	it.each([
		{ endDate: "2026-02-30", startDate: "2026-02-01" },
		{ endDate: "2026-05-01", startDate: "2026-05-02" },
	])("rejects an invalid workspace date range", (dateRange) => {
		expect(WORKSPACE_DATASET_DATE_RANGE_SCHEMA.safeParse(dateRange).success).toBe(false);
	});

	it("rejects invalid nested domain data at the workspace boundary", () => {
		const dataset = {
			...financialDatasetFixture,
			spendRequests: [{ ...financialDatasetFixture.spendRequests[0], status: "unknown" }],
		};

		expect(FINANCIAL_DATASET_SCHEMA.safeParse(dataset).success).toBe(false);
	});
});
