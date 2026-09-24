import { getPercentage } from "@/modules/money/format";
import type { MoneyCents } from "@/modules/money/types";
import type { FinancialDataset } from "@/modules/workspace/types";

type CompanyIndustry = FinancialDataset["profile"]["industry"];
type CompanyRole = FinancialDataset["profile"]["defaultRole"];

const INDUSTRY_LABELS = {
	agency: "Agency",
	consulting: "Consulting",
	"software-services": "Software Services",
} as const satisfies Record<CompanyIndustry, string>;

export const COMPANY_ROLE_LABELS = {
	employee: "Employee",
	manager: "Manager",
	"owner-finance": "Finance Lead",
} as const satisfies Record<CompanyRole, string>;

export type SettingsConfigRow =
	| {
			cents: MoneyCents;
			detail: string;
			id: string;
			kind: "money";
			label: string;
	  }
	| {
			detail: string;
			id: string;
			kind: "text";
			label: string;
			value: string;
	  };

type BuildSettingsPresentationArgs = {
	dataset: FinancialDataset;
	readOnly?: boolean;
};

export const buildSettingsPresentation = ({ dataset, readOnly = false }: BuildSettingsPresentationArgs) => {
	const { profile, teamMembers } = dataset;
	const financeLead = teamMembers.find((member) => member.role === "owner-finance") ?? teamMembers[0];
	const remainingMembers = teamMembers.filter((member) => member.id !== financeLead?.id);
	const aboveBuffer = profile.cashBalanceCents >= profile.cashBufferTargetCents;
	const bufferSharePercent = getSharePercent(profile.cashBufferTargetCents, profile.cashBalanceCents);

	return {
		aboveBuffer,
		bufferShareLabel: bufferSharePercent === undefined ? undefined : getPercentage(bufferSharePercent),
		bufferSharePercent,
		cashBalanceCents: profile.cashBalanceCents,
		cashBufferTargetCents: profile.cashBufferTargetCents,
		companyId: profile.companyId,
		companyName: profile.name,
		configs: getSettingsConfigs({ profile, readOnly }),
		contextLine: getContextLine(profile.name, readOnly),
		defaultRoleLabel: COMPANY_ROLE_LABELS[profile.defaultRole],
		financeLead,
		headline: getSettingsHeadline(profile.name, profile.industry, teamMembers.length),
		industryLabel: INDUSTRY_LABELS[profile.industry],
		memberCount: teamMembers.length,
		memberCountLabel: formatMemberCount(teamMembers.length),
		monthlyPayrollCents: profile.monthlyPayrollCents,
		remainingMembers,
	};
};

function getContextLine(companyName: string, readOnly: boolean) {
	return readOnly ? `${companyName} · Settings · Public demo` : `${companyName} · Settings`;
}

function getSettingsHeadline(name: string, industry: CompanyIndustry, memberCount: number) {
	const industryPhrase = getIndustryPhrase(industry);

	if (memberCount === 0) {
		return `${name} is ${industryPhrase} workspace`;
	}

	return `${name} is ${industryPhrase} workspace with ${formatMemberCount(memberCount)}`;
}

function getIndustryPhrase(industry: CompanyIndustry) {
	const phrases = {
		agency: "an agency",
		consulting: "a consulting",
		"software-services": "a software services",
	} as const satisfies Record<CompanyIndustry, string>;

	return phrases[industry];
}

function formatMemberCount(memberCount: number) {
	return memberCount === 1 ? "1 company member" : `${memberCount} company members`;
}

function getSettingsConfigs({
	profile,
	readOnly,
}: {
	profile: FinancialDataset["profile"];
	readOnly: boolean;
}): SettingsConfigRow[] {
	const configs: SettingsConfigRow[] = [
		{
			detail: "Service-firm workflow for this company workspace.",
			id: "industry",
			kind: "text",
			label: "Industry",
			value: INDUSTRY_LABELS[profile.industry],
		},
		{
			detail: "Who this company workspace is configured for.",
			id: "default-role",
			kind: "text",
			label: "Default role",
			value: COMPANY_ROLE_LABELS[profile.defaultRole],
		},
		{
			detail: "Identifier for this company workspace.",
			id: "workspace-id",
			kind: "text",
			label: "Workspace ID",
			value: profile.companyId,
		},
		{
			cents: profile.cashBufferTargetCents,
			detail: "Reserve that should remain after expected inflows and outflows.",
			id: "cash-buffer",
			kind: "money",
			label: "Cash buffer",
		},
		{
			cents: profile.monthlyPayrollCents,
			detail: "Recurring payroll cost used in cash decisions, not payroll execution.",
			id: "monthly-payroll",
			kind: "money",
			label: "Monthly payroll",
		},
		{
			detail: "CashLift authorizes cash decisions and does not move or custody money.",
			id: "money-movement",
			kind: "text",
			label: "Money movement",
			value: "Off",
		},
		{
			detail: readOnly
				? "Checked-in Studio Nova fixture. Changes are not saved."
				: "Records loaded for this company workspace.",
			id: "workspace-data",
			kind: "text",
			label: "Workspace data",
			value: readOnly ? "Public demo fixtures" : "Company records",
		},
	];

	if (readOnly) {
		configs.push({
			detail: "Invoices, bills, budgets, and renewals use mocked accounting-style records.",
			id: "accounting-source",
			kind: "text",
			label: "Accounting source",
			value: "QuickBooks, Xero, bank feed",
		});
	}

	return configs;
}

function getSharePercent(part: MoneyCents, whole: MoneyCents) {
	if (whole === 0) {
		return;
	}

	return (part / whole) * 100;
}
