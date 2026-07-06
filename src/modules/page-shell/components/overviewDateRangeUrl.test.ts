import { describe, expect, it } from "vitest";
import { getOverviewDateRangeHref } from "./overviewDateRangeUrl";

describe("overview date range URL", () => {
	it("adds selected date params while preserving unrelated params", () => {
		expect(
			getOverviewDateRangeHref({
				currentHref: "https://cashlift.test/dashboard?tab=overview",
				dateRange: { endDate: "2026-05-20", startDate: "2026-05-10" },
				defaultDateRange: { endDate: "2026-06-17", startDate: "2026-05-06" },
			}),
		).toEqual("/dashboard?tab=overview&endDate=2026-05-20&startDate=2026-05-10");
	});

	it("omits date params for the default range", () => {
		expect(
			getOverviewDateRangeHref({
				currentHref: "https://cashlift.test/dashboard?endDate=2026-05-20&startDate=2026-05-10&tab=overview",
				dateRange: { endDate: "2026-06-17", startDate: "2026-05-06" },
				defaultDateRange: { endDate: "2026-06-17", startDate: "2026-05-06" },
			}),
		).toEqual("/dashboard?tab=overview");
	});
});
