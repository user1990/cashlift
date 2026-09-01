import { describe, expect, it } from "vitest";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { reduceDatasetForDateRange, reduceDatasetForScope } from "./read-models";

describe("workspace read models", () => {
	it("filters overview data to the selected date range", () => {
		const dataset = reduceDatasetForDateRange(financialDatasetFixture, {
			endDate: "2026-05-20",
			startDate: "2026-05-10",
		});

		expect(dataset.forecast.map((point) => point.date)).toEqual(["2026-05-13", "2026-05-20"]);
		expect(dataset.cashActions.map((action) => action.dueDate)).toEqual(["2026-05-10", "2026-05-12", "2026-05-13"]);
		expect(
			dataset.invoices.every((invoice) => invoice.dueDate >= "2026-05-10" && invoice.dueDate <= "2026-05-20"),
		).toBe(true);
		expect(dataset.profile).toBe(financialDatasetFixture.profile);
		expect(dataset.teamBudgets).toBe(financialDatasetFixture.teamBudgets);
	});

	it("keeps cash outlook and buffer inputs on the cash scope", () => {
		const dataset = reduceDatasetForScope(financialDatasetFixture, "cash");

		expect(dataset.forecast).toEqual(financialDatasetFixture.forecast);
		expect(dataset.cashActions).toEqual(financialDatasetFixture.cashActions);
		expect(dataset.invoices).toEqual(financialDatasetFixture.invoices);
		expect(dataset.vendorBills).toEqual(financialDatasetFixture.vendorBills);
		expect(dataset.subscriptions).toEqual(financialDatasetFixture.subscriptions);
		expect(dataset.spendRequests).toEqual(financialDatasetFixture.spendRequests);
		expect(dataset.teamBudgets).toEqual(financialDatasetFixture.teamBudgets);
		expect(dataset.teamMembers).toEqual([]);
		expect(dataset.profile).toBe(financialDatasetFixture.profile);
	});
});
