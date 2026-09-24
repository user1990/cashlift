import { describe, expect, it } from "vitest";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { getInvoiceRiskTotal, isInvoiceOverdue } from "./utils";

describe("invoice utils", () => {
	it("sums overdue invoice risk and excludes paid invoices", () => {
		const date = new Date("2026-05-09");
		const overdueIds = financialDatasetFixture.invoices
			.filter((invoice) => isInvoiceOverdue(invoice, date))
			.map((invoice) => invoice.id);

		expect(overdueIds).toEqual(["invoice-northstar"]);
		expect(getInvoiceRiskTotal(financialDatasetFixture.invoices, date)).toEqual(1_840_000);
	});
});
