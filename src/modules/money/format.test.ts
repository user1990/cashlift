import { describe, expect, it } from "vitest";
import { formatCurrency, getPercentage } from "./format";

describe("money formatters", () => {
	it("formats currency from raw cents and handles negative values as magnitude", () => {
		expect(formatCurrency(940_000)).toEqual("$9,400");
		expect(formatCurrency(-20_000)).toEqual("$200");
	});

	it("formats percentages from raw values", () => {
		expect(getPercentage(82.4)).toEqual("82%");
	});
});
