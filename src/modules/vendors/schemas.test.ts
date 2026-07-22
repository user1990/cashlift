import { describe, expect, it } from "vitest";
import { vendorBillSchema } from "./schemas";

const vendorBill = {
	amountCents: 120_000,
	category: "software",
	dueDate: "2026-05-14",
	essential: true,
	id: "vendor-bill-1",
	status: "scheduled",
	vendor: "Northstar",
};

describe("vendorBillSchema", () => {
	it.each([
		["valid values", vendorBill, true],
		["negative cents", { ...vendorBill, amountCents: -1 }, false],
		["fractional cents", { ...vendorBill, amountCents: 1.5 }, false],
		["invalid due date", { ...vendorBill, dueDate: "14/05/2026" }, false],
	])("%s", (_, value, valid) => {
		expect(vendorBillSchema.safeParse(value).success).toBe(valid);
	});
});
