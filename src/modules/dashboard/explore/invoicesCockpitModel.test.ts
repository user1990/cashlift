import { describe, expect, it } from "vitest";
import { formatCurrency } from "@/modules/money/format";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { buildInvoicesCockpitPresentation } from "./invoicesCockpitModel";

describe("invoices cockpit presentation", () => {
	it("groups invoices from stored status until an as-of date is supplied", () => {
		const presentation = buildInvoicesCockpitPresentation({
			dataset: financialDatasetFixture,
			invoiceRiskTotal: 1_840_000,
		});

		expect(presentation.headline).toEqual(`${formatCurrency(1_840_000)} overdue cash risk`);
		expect(presentation.overdue.map((invoice) => invoice.id)).toEqual(["invoice-northstar"]);
		expect(presentation.openOnTime.map((invoice) => invoice.id)).toEqual(["invoice-brightline", "invoice-harbor"]);
		expect(presentation.paid.map((invoice) => invoice.id)).toEqual(["invoice-summit"]);
		expect(presentation.primaryInvoice?.client).toEqual("Northstar Labs");
		expect(presentation.primaryAction?.title).toEqual("Chase Northstar Labs invoice");
	});

	it("moves a past-due sent invoice into overdue once the browser date is known", () => {
		const presentation = buildInvoicesCockpitPresentation({
			asOfDate: new Date("2026-05-15T00:00:00"),
			dataset: financialDatasetFixture,
			invoiceRiskTotal: 4_590_000,
		});

		expect(presentation.headline).toEqual(`${formatCurrency(4_590_000)} overdue cash risk`);
		expect(presentation.overdue.map((invoice) => invoice.id)).toEqual(["invoice-brightline", "invoice-northstar"]);
		expect(presentation.queueInvoices.map((invoice) => invoice.id)).toEqual(["invoice-northstar"]);
		expect(presentation.openOnTime.map((invoice) => invoice.id)).toEqual(["invoice-harbor"]);
		expect(presentation.dueSchedule.map((invoice) => invoice.id)).toEqual([
			"invoice-northstar",
			"invoice-brightline",
			"invoice-harbor",
		]);
	});
});
