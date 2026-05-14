import type { SupabaseClient } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/services/supabase/server";
import type { FinanceRepository } from "../api";
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

type CompanyMemberRow = {
	company_id: string;
};

type CompanyRow = {
	cash_balance_cents: number;
	cash_buffer_target_cents: number;
	default_role: CompanyRole;
	id: string;
	industry: FinancialDataset["profile"]["industry"];
	monthly_payroll_cents: number;
	name: string;
};

type TeamMemberRow = {
	id: string;
	name: string;
	role: CompanyRole;
	team: string;
};

type InvoiceRow = {
	amount_cents: number;
	client: string;
	collection_probability: number;
	due_date: string;
	id: string;
	owner: string;
	status: InvoiceStatus;
};

type VendorBillRow = {
	amount_cents: number;
	category: FinancialDataset["vendorBills"][number]["category"];
	due_date: string;
	essential: boolean;
	id: string;
	status: VendorBillStatus;
	vendor: string;
};

type SubscriptionRow = {
	amount_cents: number;
	id: string;
	owner: string;
	renewal_date: string;
	status: SubscriptionStatus;
	usage_percent: number;
	vendor: string;
};

type SpendRequestRow = {
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

type TeamBudgetRow = {
	approved_cents: number;
	committed_cents: number;
	id: string;
	monthly_budget_cents: number;
	team: string;
};

type CashActionRow = {
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

type ForecastPointRow = {
	date: string;
	id: string;
	inflow_cents: number;
	opening_balance_cents: number;
	outflow_cents: number;
	scenario: FinancialDataset["forecast"][number]["scenario"];
};

export class CompanyMembershipNotFoundError extends Error {
	constructor() {
		super("No company workspace is assigned to this user.");
		this.name = "CompanyMembershipNotFoundError";
	}
}

const selectCompanyId = async (client: SupabaseClient, userId: string) => {
	const { data, error } = await client
		.from("company_members")
		.select("company_id")
		.eq("clerk_user_id", userId)
		.limit(1)
		.maybeSingle<CompanyMemberRow>();

	if (error) {
		throw new Error(`Unable to find company membership: ${error.message}`);
	}

	if (!data) {
		throw new CompanyMembershipNotFoundError();
	}

	return data.company_id;
};

const selectRows = async <Row>(query: PromiseLike<{ data: Row[] | null; error: { message: string } | null }>) => {
	const { data, error } = await query;

	if (error) {
		throw new Error(error.message);
	}

	return data ?? [];
};

const selectSingleRow = async <Row>(query: PromiseLike<{ data: Row | null; error: { message: string } | null }>) => {
	const { data, error } = await query;

	if (error) {
		throw new Error(error.message);
	}

	if (!data) {
		throw new Error("Expected one row but received none.");
	}

	return data;
};

const getDatasetByCompanyId = async (client: SupabaseClient, companyId: string): Promise<FinancialDataset> => {
	const [
		company,
		teamMembers,
		invoices,
		vendorBills,
		subscriptions,
		spendRequests,
		teamBudgets,
		cashActions,
		forecast,
	] = await Promise.all([
		selectSingleRow<CompanyRow>(client.from("companies").select("*").eq("id", companyId).single()),
		selectRows<TeamMemberRow>(
			client.from("company_members").select("id, name, role, team").eq("company_id", companyId),
		),
		selectRows<InvoiceRow>(client.from("invoices").select("*").eq("company_id", companyId).order("due_date")),
		selectRows<VendorBillRow>(client.from("vendor_bills").select("*").eq("company_id", companyId).order("due_date")),
		selectRows<SubscriptionRow>(
			client.from("subscriptions").select("*").eq("company_id", companyId).order("renewal_date"),
		),
		selectRows<SpendRequestRow>(
			client.from("spend_requests").select("*").eq("company_id", companyId).order("needed_by_date"),
		),
		selectRows<TeamBudgetRow>(client.from("team_budgets").select("*").eq("company_id", companyId).order("team")),
		selectRows<CashActionRow>(client.from("cash_actions").select("*").eq("company_id", companyId).order("due_date")),
		selectRows<ForecastPointRow>(client.from("forecast_points").select("*").eq("company_id", companyId).order("date")),
	]);

	return {
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
		spendRequests: spendRequests.map((request) => ({
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
		})),
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
	};
};

export const supabaseFinanceRepository: FinanceRepository & {
	getDashboardDatasetByCompanyId(companyId: string): Promise<FinancialDataset>;
} = {
	async getDashboardDataset(userId, accessToken) {
		const client = createServerSupabaseClient({ accessToken });
		const companyId = await selectCompanyId(client, userId);

		return getDatasetByCompanyId(client, companyId);
	},
	async getDashboardDatasetByCompanyId(companyId) {
		const client = createServerSupabaseClient();

		return getDatasetByCompanyId(client, companyId);
	},
};
