import type {
	ActionPriority,
	ActionStatus,
	CashActionType,
	CompanyRole,
	FinancialDataset,
	InvoiceStatus,
	SpendRequestStatus,
	SubscriptionStatus,
	VendorBillStatus,
} from "../types";

export type CompanyRow = {
	cash_balance_cents: number;
	cash_buffer_target_cents: number;
	default_role: CompanyRole;
	id: string;
	industry: FinancialDataset["profile"]["industry"];
	monthly_payroll_cents: number;
	name: string;
};

export type TeamMemberRow = {
	id: string;
	name: string;
	role: CompanyRole;
	team: string;
};

export type InvoiceRow = {
	amount_cents: number;
	client: string;
	collection_probability: number;
	due_date: string;
	id: string;
	owner: string;
	status: InvoiceStatus;
};

export type VendorBillRow = {
	amount_cents: number;
	category: FinancialDataset["vendorBills"][number]["category"];
	due_date: string;
	essential: boolean;
	id: string;
	status: VendorBillStatus;
	vendor: string;
};

export type SubscriptionRow = {
	amount_cents: number;
	id: string;
	owner: string;
	renewal_date: string;
	status: SubscriptionStatus;
	usage_percent: number;
	vendor: string;
};

export type SpendRequestRow = {
	amount_cents: number;
	category: FinancialDataset["spendRequests"][number]["category"];
	id: string;
	needed_by_date: string;
	reason: string;
	requested_date: string;
	requester: string;
	status: SpendRequestStatus;
	team: string;
	vendor: string;
};

export type TeamBudgetRow = {
	approved_cents: number;
	committed_cents: number;
	id: string;
	monthly_budget_cents: number;
	team: string;
};

export type CashActionRow = {
	description: string;
	due_date: string;
	id: string;
	impact_cents: number;
	owner: string;
	priority: ActionPriority;
	status: ActionStatus;
	title: string;
	type: CashActionType;
	visible_to: CompanyRole[];
};

export type ForecastPointRow = {
	date: string;
	id: string;
	inflow_cents: number;
	opening_balance_cents: number;
	outflow_cents: number;
	scenario: FinancialDataset["forecast"][number]["scenario"];
};

type DatasetRows = {
	cashActions: CashActionRow[];
	company: CompanyRow;
	forecast: ForecastPointRow[];
	invoices: InvoiceRow[];
	spendRequests: SpendRequestRow[];
	subscriptions: SubscriptionRow[];
	teamBudgets: TeamBudgetRow[];
	teamMembers: TeamMemberRow[];
	vendorBills: VendorBillRow[];
};

export const mapSpendRequest = (request: SpendRequestRow) => ({
	amountCents: request.amount_cents,
	category: request.category,
	id: request.id,
	neededByDate: request.needed_by_date,
	reason: request.reason,
	requestedDate: request.requested_date,
	requester: request.requester,
	status: request.status,
	team: request.team,
	vendor: request.vendor,
});

export const mapFinancialDataset = ({
	cashActions,
	company,
	forecast,
	invoices,
	spendRequests,
	subscriptions,
	teamBudgets,
	teamMembers,
	vendorBills,
}: DatasetRows): FinancialDataset => ({
	cashActions: cashActions.map((action) => ({
		description: action.description,
		dueDate: action.due_date,
		id: action.id,
		impactCents: action.impact_cents,
		owner: action.owner,
		priority: action.priority,
		status: action.status,
		title: action.title,
		type: action.type,
		visibleTo: action.visible_to,
	})),
	forecast: forecast.map((point) => ({
		date: point.date,
		id: point.id,
		inflowCents: point.inflow_cents,
		openingBalanceCents: point.opening_balance_cents,
		outflowCents: point.outflow_cents,
		scenario: point.scenario,
	})),
	invoices: invoices.map((invoice) => ({
		amountCents: invoice.amount_cents,
		client: invoice.client,
		collectionProbability: invoice.collection_probability,
		dueDate: invoice.due_date,
		id: invoice.id,
		owner: invoice.owner,
		status: invoice.status,
	})),
	profile: {
		cashBalanceCents: company.cash_balance_cents,
		cashBufferTargetCents: company.cash_buffer_target_cents,
		companyId: company.id,
		defaultRole: company.default_role,
		industry: company.industry,
		monthlyPayrollCents: company.monthly_payroll_cents,
		name: company.name,
	},
	spendRequests: spendRequests.map(mapSpendRequest),
	subscriptions: subscriptions.map((subscription) => ({
		amountCents: subscription.amount_cents,
		id: subscription.id,
		owner: subscription.owner,
		renewalDate: subscription.renewal_date,
		status: subscription.status,
		usagePercent: subscription.usage_percent,
		vendor: subscription.vendor,
	})),
	teamBudgets: teamBudgets.map((budget) => ({
		approvedCents: budget.approved_cents,
		committedCents: budget.committed_cents,
		id: budget.id,
		monthlyBudgetCents: budget.monthly_budget_cents,
		team: budget.team,
	})),
	teamMembers: teamMembers.map((member) => ({
		id: member.id,
		name: member.name,
		role: member.role,
		team: member.team,
	})),
	vendorBills: vendorBills.map((bill) => ({
		amountCents: bill.amount_cents,
		category: bill.category,
		dueDate: bill.due_date,
		essential: bill.essential,
		id: bill.id,
		status: bill.status,
		vendor: bill.vendor,
	})),
});
