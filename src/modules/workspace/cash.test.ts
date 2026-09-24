import { describe, expect, it } from "vitest";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { getCashBufferRisk } from "./cash";

describe("workspace cash", () => {
	it("keeps cash buffer risk at zero when projected cash stays above target", () => {
		expect(getCashBufferRisk(financialDatasetFixture, new Date("2026-05-09"))).toEqual(0);
	});
});
