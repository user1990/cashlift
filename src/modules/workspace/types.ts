import type { z } from "zod";
import type { financialDatasetSchema, workspaceDatasetScopeSchema } from "./schemas";

export type { ActionPriority, ActionStatus, CashActionType } from "@/modules/cash-actions/types";
export type { CompanyRole } from "@/modules/company-memberships/types";
export type { InvoiceStatus } from "@/modules/invoices/types";
export type { SpendRequest, SpendRequestStatus } from "@/modules/spend-requests/types";
export type { SubscriptionStatus } from "@/modules/subscriptions/types";
export type { VendorBillStatus } from "@/modules/vendors/types";

export type WorkspaceDatasetScope = z.infer<typeof workspaceDatasetScopeSchema>;

export type FinancialDataset = z.infer<typeof financialDatasetSchema>;
