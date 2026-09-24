import { describe, expect, it } from "vitest";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { getCashBufferRisk, getRunwayDays } from "./cash";

describe("workspace cash", () => {
	it("keeps cash buffer risk at zero when projected cash stays above target", () => {
		expect(getCashBufferRisk(financialDatasetFixture, new Date("2026-05-09"))).toEqual(0);
	});

	it("returns undefined runway when recurring spend is not modeled", () => {
		expect(
			getRunwayDays({
				...financialDatasetFixture,
				profile: { ...financialDatasetFixture.profile, monthlyPayrollCents: 0 },
				subscriptions: [],
				vendorBills: financialDatasetFixture.vendorBills.map((bill) => ({ ...bill, essential: false })),
			}),
		).toBeUndefined();
	});
});
