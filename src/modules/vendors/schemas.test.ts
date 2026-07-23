import { describe, expect, it } from "vitest";
import { vendorBillSchema } from "./schemas";

const VENDOR_BILL_MOCK = {
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
		["valid values", VENDOR_BILL_MOCK, true],
		["negative cents", { ...VENDOR_BILL_MOCK, amountCents: -1 }, false],
		["fractional cents", { ...VENDOR_BILL_MOCK, amountCents: 1.5 }, false],
		["invalid due date", { ...VENDOR_BILL_MOCK, dueDate: "14/05/2026" }, false],
	])("%s", (_, value, valid) => {
		expect(vendorBillSchema.safeParse(value).success).toBe(valid);
	});
});
