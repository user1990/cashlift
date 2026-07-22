import { describe, expect, it } from "vitest";
import { invoiceSchema } from "./schemas";

const invoice = {
	amountCents: 120_000,
	client: "Northstar Labs",
	collectionProbability: 62,
	dueDate: "2026-05-14",
	id: "invoice-northstar",
	owner: "Iris",
	status: "sent",
};

describe("invoiceSchema", () => {
	it("accepts valid persisted invoice values", () => {
		expect(invoiceSchema.parse(invoice)).toEqual(invoice);
	});

	it.each([
		["negative cents", { amountCents: -1 }],
		["fractional cents", { amountCents: 1.5 }],
		["invalid due date", { dueDate: "14/05/2026" }],
		["probability below zero", { collectionProbability: -1 }],
		["probability above one hundred", { collectionProbability: 101 }],
	])("rejects %s", (_, override) => {
		expect(invoiceSchema.safeParse({ ...invoice, ...override }).success).toBe(false);
	});
});
