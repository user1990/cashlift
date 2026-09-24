import { describe, expect, it } from "vitest";
import { formatCashAfterApproval } from "./utils";

describe("formatCashAfterApproval", () => {
	it("labels shortfall when approval exceeds cash on hand", () => {
		expect(formatCashAfterApproval(-2_000_000)).toEqual("short by $20,000");
	});

	it("formats positive cash after approval", () => {
		expect(formatCashAfterApproval(5_000_000)).toEqual("$50,000");
	});
});
