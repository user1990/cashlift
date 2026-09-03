import { describe, expect, it } from "vitest";
import { getPercentage } from "@/modules/money/format";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { buildSettingsPresentation } from "./settingsPresentation";

describe("settings presentation", () => {
	it("derives headline, guardrails, and config rows from the current company profile", () => {
		const presentation = buildSettingsPresentation({ dataset: financialDatasetFixture });
		const { profile, teamMembers } = financialDatasetFixture;
		const [maya, leo, nora] = teamMembers;

		expect(presentation.headline).toEqual("Studio Nova is an agency workspace with 3 company members");
		expect(presentation.contextLine).toEqual("Studio Nova · Settings");
		expect(presentation.companyId).toEqual(profile.companyId);
		expect(presentation.cashBalanceCents).toEqual(profile.cashBalanceCents);
		expect(presentation.cashBufferTargetCents).toEqual(profile.cashBufferTargetCents);
		expect(presentation.monthlyPayrollCents).toEqual(profile.monthlyPayrollCents);
		expect(presentation.aboveBuffer).toEqual(profile.cashBalanceCents >= profile.cashBufferTargetCents);
		expect(presentation.industryLabel).toEqual("Agency");
		expect(presentation.defaultRoleLabel).toEqual("Finance Lead");
		expect(presentation.financeLead).toEqual(maya);
		expect(presentation.memberCount).toEqual(teamMembers.length);
		expect(presentation.memberCountLabel).toEqual("3 company members");
		expect(presentation.remainingMembers).toEqual([leo, nora]);
		expect(presentation.configs.map((config) => config.id)).toEqual([
			"industry",
			"default-role",
			"workspace-id",
			"cash-buffer",
			"monthly-payroll",
			"money-movement",
			"workspace-data",
		]);
		expect(presentation.configs.find((config) => config.id === "cash-buffer")).toMatchObject({
			cents: profile.cashBufferTargetCents,
			kind: "money",
		});
		expect(presentation.configs.find((config) => config.id === "money-movement")).toMatchObject({
			kind: "text",
			value: "Off",
		});
		expect(presentation.configs.find((config) => config.id === "workspace-data")).toMatchObject({
			kind: "text",
			value: "Company records",
		});
		expect(presentation.bufferShareLabel).toEqual(
			getPercentage((profile.cashBufferTargetCents / profile.cashBalanceCents) * 100),
		);
	});

	it("keeps demo data-source copy and empty-member headlines honest", () => {
		const demoPresentation = buildSettingsPresentation({ dataset: financialDatasetFixture, readOnly: true });
		const emptyPresentation = buildSettingsPresentation({
			dataset: { ...financialDatasetFixture, teamMembers: [] },
		});
		const consultingPresentation = buildSettingsPresentation({
			dataset: {
				...financialDatasetFixture,
				profile: { ...financialDatasetFixture.profile, industry: "consulting" },
				teamMembers: [financialDatasetFixture.teamMembers[0]],
			},
		});

		expect(demoPresentation.contextLine).toEqual("Studio Nova · Settings · Public demo");
		expect(demoPresentation.configs.find((config) => config.id === "workspace-data")).toMatchObject({
			value: "Public demo fixtures",
		});
		expect(demoPresentation.configs.find((config) => config.id === "accounting-source")).toMatchObject({
			value: "QuickBooks, Xero, bank feed",
		});
		expect(emptyPresentation.headline).toEqual("Studio Nova is an agency workspace");
		expect(emptyPresentation.financeLead).toBeUndefined();
		expect(consultingPresentation.headline).toEqual("Studio Nova is a consulting workspace with 1 company member");
	});
});
