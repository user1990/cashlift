import type { TeamBudget } from "@/modules/budgets/types";
import type { CashAction } from "@/modules/cash-actions/types";
import type { ForecastPoint } from "@/modules/cash-outlook/types";
import type { Invoice } from "@/modules/invoices/types";
import type { MoneyCents } from "@/modules/money/types";
import type { SpendRequest } from "@/modules/spend-requests/types";
import type { Subscription } from "@/modules/subscriptions/types";
import type { VendorBill } from "@/modules/vendors/types";

export type { TeamBudget } from "@/modules/budgets/types";
export type { ActionPriority, ActionStatus, CashAction, CashActionType } from "@/modules/cash-actions/types";
export type { ForecastPoint } from "@/modules/cash-outlook/types";
export type { Invoice, InvoiceStatus } from "@/modules/invoices/types";
export type { SpendRequest, SpendRequestStatus } from "@/modules/spend-requests/types";
export type { Subscription, SubscriptionStatus } from "@/modules/subscriptions/types";
export type { VendorBill, VendorBillStatus } from "@/modules/vendors/types";

export type CompanyRole = "owner-finance" | "manager" | "employee";

export type CompanyProfile = {
	companyId: string;
	name: string;
	industry: "agency" | "consulting" | "software-services";
	cashBalanceCents: MoneyCents;
	cashBufferTargetCents: MoneyCents;
	monthlyPayrollCents: MoneyCents;
	defaultRole: CompanyRole;
};

export type TeamMember = {
	id: string;
	name: string;
	role: CompanyRole;
	team: string;
};

export type FinancialDataset = {
	profile: CompanyProfile;
	teamMembers: TeamMember[];
	invoices: Invoice[];
	vendorBills: VendorBill[];
	subscriptions: Subscription[];
	spendRequests: SpendRequest[];
	teamBudgets: TeamBudget[];
	cashActions: CashAction[];
	forecast: ForecastPoint[];
};
