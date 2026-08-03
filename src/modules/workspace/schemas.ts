import { z } from "zod";
import { TEAM_BUDGET_SCHEMA } from "@/modules/budgets/schemas";
import { CASH_ACTION_SCHEMA } from "@/modules/cash-actions/schemas";
import { FORECAST_POINT_SCHEMA } from "@/modules/cash-outlook/schemas";
import { COMPANY_ROLE_SCHEMA } from "@/modules/company-roles/schemas";
import { INVOICE_SCHEMA } from "@/modules/invoices/schemas";
import { MONEY_CENTS_SCHEMA } from "@/modules/money/schemas";
import { SPEND_REQUEST_SCHEMA } from "@/modules/spend-requests/schemas";
import { SUBSCRIPTION_SCHEMA } from "@/modules/subscriptions/schemas";
import { VENDOR_BILL_SCHEMA } from "@/modules/vendors/schemas";

export const WORKSPACE_DATASET_SCOPE_SCHEMA = z.enum([
	"approvals",
	"budgets",
	"cash",
	"invoices",
	"overview",
	"settings",
	"team",
	"vendors",
]);

const ISO_DATE_SCHEMA = z.iso.date();

export const WORKSPACE_DATASET_DATE_RANGE_SCHEMA = z
	.object({
		endDate: ISO_DATE_SCHEMA,
		startDate: ISO_DATE_SCHEMA,
	})
	.refine(({ endDate, startDate }) => startDate <= endDate, {
		message: "Start date must be before or equal to end date.",
		path: ["endDate"],
	});

const COMPANY_PROFILE_SCHEMA = z.object({
	cashBalanceCents: MONEY_CENTS_SCHEMA,
	cashBufferTargetCents: MONEY_CENTS_SCHEMA,
	companyId: z.string(),
	defaultRole: COMPANY_ROLE_SCHEMA,
	industry: z.enum(["agency", "consulting", "software-services"]),
	monthlyPayrollCents: MONEY_CENTS_SCHEMA,
	name: z.string(),
});

const TEAM_MEMBER_SCHEMA = z.object({
	id: z.string(),
	name: z.string(),
	role: COMPANY_ROLE_SCHEMA,
	team: z.string(),
});

export const FINANCIAL_DATASET_SCHEMA = z.object({
	cashActions: z.array(CASH_ACTION_SCHEMA),
	forecast: z.array(FORECAST_POINT_SCHEMA),
	invoices: z.array(INVOICE_SCHEMA),
	profile: COMPANY_PROFILE_SCHEMA,
	spendRequests: z.array(SPEND_REQUEST_SCHEMA),
	subscriptions: z.array(SUBSCRIPTION_SCHEMA),
	teamBudgets: z.array(TEAM_BUDGET_SCHEMA),
	teamMembers: z.array(TEAM_MEMBER_SCHEMA),
	vendorBills: z.array(VENDOR_BILL_SCHEMA),
});
