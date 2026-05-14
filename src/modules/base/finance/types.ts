import type { MoneyCents } from "@/modules/common/money/types";

export type CompanyRole = "owner-finance" | "manager" | "employee";

export type ActionPriority = "critical" | "high" | "medium" | "low";

export type ActionStatus = "open" | "done";

export type InvoiceStatus = "sent" | "overdue" | "promised" | "paid";

export type VendorBillStatus = "scheduled" | "needs-review" | "approved";

export type SubscriptionStatus = "active" | "unused" | "duplicate" | "trial";

export type SpendRequestStatus = "pending" | "approved" | "rejected";

export type CashActionType = "approval" | "collection" | "vendor-leak" | "cash-buffer" | "forecast";

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

export type Invoice = {
	id: string;
	client: string;
	amountCents: MoneyCents;
	dueDate: string;
	status: InvoiceStatus;
	owner: string;
	collectionProbability: number;
};

export type VendorBill = {
	id: string;
	vendor: string;
	amountCents: MoneyCents;
	dueDate: string;
	status: VendorBillStatus;
	category: "software" | "contractor" | "operations" | "tax" | "payroll";
	essential: boolean;
};

export type Subscription = {
	id: string;
	vendor: string;
	amountCents: MoneyCents;
	renewalDate: string;
	status: SubscriptionStatus;
	usagePercent: number;
	owner: string;
};

export type SpendRequest = {
	id: string;
	requester: string;
	team: string;
	vendor: string;
	amountCents: MoneyCents;
	category: "software" | "travel" | "contractor" | "marketing" | "hardware";
	reason: string;
	status: SpendRequestStatus;
	requestedDate: string;
	neededByDate: string;
};

export type TeamBudget = {
	id: string;
	team: string;
	monthlyBudgetCents: MoneyCents;
	committedCents: MoneyCents;
	approvedCents: MoneyCents;
};

export type CashAction = {
	id: string;
	type: CashActionType;
	title: string;
	description: string;
	impactCents: MoneyCents;
	dueDate: string;
	priority: ActionPriority;
	owner: string;
	status: ActionStatus;
	visibleTo: CompanyRole[];
};

export type ForecastPoint = {
	id: string;
	date: string;
	openingBalanceCents: MoneyCents;
	inflowCents: MoneyCents;
	outflowCents: MoneyCents;
	scenario: "base" | "delayed-client" | "approved-spend";
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
