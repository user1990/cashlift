import { describe, expect, it } from "vitest";
import { formatCurrency, formatCurrencyMagnitude, getPercentage } from "./format";

describe("money formatters", () => {
	it("formats currency from raw cents and preserves negative sign", () => {
		expect(formatCurrency(940_000)).toEqual("$9,400");
		expect(formatCurrency(-20_000)).toEqual("-$200");
	});

	it("formats magnitude without a sign for shortfall copy", () => {
		expect(formatCurrencyMagnitude(-20_000)).toEqual("$200");
	});

	it("formats percentages from raw values", () => {
		expect(getPercentage(82.4)).toEqual("82%");
	});
});
