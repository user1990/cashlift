import type { z } from "zod";
import type {
	companyProfileSchema,
	financialDatasetSchema,
	teamMemberSchema,
	workspaceDatasetScopeSchema,
} from "./schemas";

export type { TeamBudget } from "@/modules/budgets/types";
export type { ActionPriority, ActionStatus, CashAction, CashActionType } from "@/modules/cash-actions/types";
export type { ForecastPoint } from "@/modules/cash-outlook/types";
export type { CompanyRole } from "@/modules/company-memberships/types";
export type { Invoice, InvoiceStatus } from "@/modules/invoices/types";
export type { SpendRequest, SpendRequestStatus } from "@/modules/spend-requests/types";
export type { Subscription, SubscriptionStatus } from "@/modules/subscriptions/types";
export type { VendorBill, VendorBillStatus } from "@/modules/vendors/types";

export type WorkspaceDatasetScope = z.infer<typeof workspaceDatasetScopeSchema>;

export type CompanyProfile = z.infer<typeof companyProfileSchema>;

export type TeamMember = z.infer<typeof teamMemberSchema>;

export type FinancialDataset = z.infer<typeof financialDatasetSchema>;
