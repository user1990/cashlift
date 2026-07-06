import { describe, expect, it } from "vitest";
import { parseInitialDateRange } from "./dateRangeParams";

describe("dashboard page date range params", () => {
	it("accepts valid date range params", () => {
		expect(parseInitialDateRange("2026-05-10", "2026-05-20")).toEqual({
			endDate: "2026-05-20",
			startDate: "2026-05-10",
		});
	});

	it("falls back silently for invalid date range params", () => {
		expect(parseInitialDateRange("bad", "2026-05-20")).toBeUndefined();
		expect(parseInitialDateRange("2026-05-20", "2026-05-10")).toBeUndefined();
		expect(parseInitialDateRange(undefined, undefined)).toBeUndefined();
	});
});
