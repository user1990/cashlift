import { z } from "zod";
import { teamBudgetSchema } from "@/modules/budgets/schemas";
import { cashActionSchema } from "@/modules/cash-actions/schemas";
import { forecastPointSchema } from "@/modules/cash-outlook/schemas";
import { companyRoleSchema } from "@/modules/company-memberships/schemas";
import { invoiceSchema } from "@/modules/invoices/schemas";
import { moneyCentsSchema } from "@/modules/money/schemas";
import { spendRequestSchema } from "@/modules/spend-requests/schemas";
import { subscriptionSchema } from "@/modules/subscriptions/schemas";
import { vendorBillSchema } from "@/modules/vendors/schemas";

export const workspaceDatasetScopeSchema = z.enum([
	"approvals",
	"budgets",
	"cash",
	"invoices",
	"overview",
	"settings",
	"team",
	"vendors",
]);

const companyProfileSchema = z.object({
	cashBalanceCents: moneyCentsSchema,
	cashBufferTargetCents: moneyCentsSchema,
	companyId: z.string(),
	defaultRole: companyRoleSchema,
	industry: z.enum(["agency", "consulting", "software-services"]),
	monthlyPayrollCents: moneyCentsSchema,
	name: z.string(),
});

const teamMemberSchema = z.object({
	id: z.string(),
	name: z.string(),
	role: companyRoleSchema,
	team: z.string(),
});

export const financialDatasetSchema = z.object({
	cashActions: z.array(cashActionSchema),
	forecast: z.array(forecastPointSchema),
	invoices: z.array(invoiceSchema),
	profile: companyProfileSchema,
	spendRequests: z.array(spendRequestSchema),
	subscriptions: z.array(subscriptionSchema),
	teamBudgets: z.array(teamBudgetSchema),
	teamMembers: z.array(teamMemberSchema),
	vendorBills: z.array(vendorBillSchema),
});
