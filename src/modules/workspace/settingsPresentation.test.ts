import { describe, expect, it } from "vitest";
import { getPercentage } from "@/modules/money/format";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { buildSettingsPresentation } from "./settingsPresentation";

describe("settings presentation", () => {
	it("derives members, guardrails, and a demo-only accounting source from the current company profile", () => {
		const presentation = buildSettingsPresentation({ dataset: financialDatasetFixture });
		const demoPresentation = buildSettingsPresentation({ dataset: financialDatasetFixture, readOnly: true });
		const emptyPresentation = buildSettingsPresentation({
			dataset: { ...financialDatasetFixture, teamMembers: [] },
		});
		const { profile, teamMembers } = financialDatasetFixture;
		const [maya, leo, nora] = teamMembers;
		const liveConfigIds = [
			"industry",
			"default-role",
			"workspace-id",
			"cash-buffer",
			"monthly-payroll",
			"money-movement",
			"workspace-data",
		];

		expect(presentation.companyId).toEqual(profile.companyId);
		expect(presentation.cashBalanceCents).toEqual(profile.cashBalanceCents);
		expect(presentation.cashBufferTargetCents).toEqual(profile.cashBufferTargetCents);
		expect(presentation.monthlyPayrollCents).toEqual(profile.monthlyPayrollCents);
		expect(presentation.aboveBuffer).toEqual(profile.cashBalanceCents >= profile.cashBufferTargetCents);
		expect(presentation.financeLead).toEqual(maya);
		expect(presentation.memberCount).toEqual(teamMembers.length);
		expect(presentation.remainingMembers).toEqual([leo, nora]);
		expect(presentation.configs.map((config) => config.id)).toEqual(liveConfigIds);
		expect(presentation.configs.find((config) => config.id === "cash-buffer")).toMatchObject({
			cents: profile.cashBufferTargetCents,
			kind: "money",
		});
		expect(presentation.bufferShareLabel).toEqual(
			getPercentage((profile.cashBufferTargetCents / profile.cashBalanceCents) * 100),
		);
		expect(demoPresentation.configs.map((config) => config.id)).toEqual([...liveConfigIds, "accounting-source"]);
		expect(emptyPresentation.financeLead).toBeUndefined();
		expect(emptyPresentation.memberCount).toEqual(0);
		expect(emptyPresentation.remainingMembers).toEqual([]);
	});
});
