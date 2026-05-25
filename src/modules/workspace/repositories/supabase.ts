import type { SupabaseClient } from "@supabase/supabase-js";
import { selectCompanyId } from "@/modules/company-memberships/repositories/supabase";
import { spendRequestSchema } from "@/modules/spend-requests/schemas";
import { createServerSupabaseClient } from "@/services/supabase/server";
import { AppError } from "@/utilities/errors/AppError";
import type { FinanceRepository } from "../api";
import { financialDatasetSchema } from "../schemas";
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
	WorkspaceDatasetScope,
} from "../types";

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

type SupabaseQueryError = {
	code?: string;
	message: string;
};

type SupabaseQueryResult<Data> = {
	data: Data | null;
	error: SupabaseQueryError | null;
};

export class SpendRequestNotFoundError extends AppError {
	constructor() {
		super({
			code: "supabase_empty_row",
			message: "Spend request was not found.",
		});
		this.name = "SpendRequestNotFoundError";
	}
}

const getSupabaseQueryData = async <Data>(
	table: string,
	query: PromiseLike<SupabaseQueryResult<Data>>,
	message = `Unable to load ${table}.`,
) => {
	const { data, error } = await query;

	if (error) {
		throw new AppError({
			cause: error,
			code: "supabase_query_failed",
			details: { table, supabaseCode: error.code },
			message,
		});
	}

	return data;
};

const selectRows = async <Row>(table: string, query: PromiseLike<SupabaseQueryResult<Row[]>>) => {
	const data = await getSupabaseQueryData(table, query);

	return data ?? [];
};

const selectSingleRow = async <Row>(table: string, query: PromiseLike<SupabaseQueryResult<Row>>) => {
	const data = await getSupabaseQueryData(table, query);

	if (!data) {
		throw new AppError({
			code: "supabase_empty_row",
			details: { table },
			message: `Expected one ${table} row but received none.`,
		});
	}

	return data;
};

const EMPTY_DATASET_PARTS = {
	cashActions: [],
	forecast: [],
	invoices: [],
	spendRequests: [],
	subscriptions: [],
	teamBudgets: [],
	teamMembers: [],
	vendorBills: [],
} as const satisfies Omit<FinancialDataset, "profile">;

type DatasetTable = keyof Omit<FinancialDataset, "profile">;

const SCOPE_TABLES = {
	approvals: ["spendRequests"],
	budgets: ["teamBudgets"],
	cash: [],
	invoices: ["invoices"],
	overview: [
		"cashActions",
		"forecast",
		"invoices",
		"spendRequests",
		"subscriptions",
		"teamBudgets",
		"teamMembers",
		"vendorBills",
	],
	settings: [],
	team: ["teamMembers"],
	vendors: ["subscriptions"],
} as const satisfies Record<WorkspaceDatasetScope, readonly DatasetTable[]>;

const shouldLoadTable = (scope: WorkspaceDatasetScope, table: DatasetTable) =>
	(SCOPE_TABLES[scope] as readonly DatasetTable[]).includes(table);

const selectCompany = async (client: SupabaseClient, companyId: string) =>
	selectSingleRow<CompanyRow>("companies", client.from("companies").select("*").eq("id", companyId).single());

const selectTeamMembers = async (client: SupabaseClient, companyId: string) =>
	selectRows<TeamMemberRow>(
		"company_members",
		client.from("company_members").select("id, name, role, team").eq("company_id", companyId),
	);

const selectInvoices = async (client: SupabaseClient, companyId: string) =>
	selectRows<InvoiceRow>("invoices", client.from("invoices").select("*").eq("company_id", companyId).order("due_date"));

const selectVendorBills = async (client: SupabaseClient, companyId: string) =>
	selectRows<VendorBillRow>(
		"vendor_bills",
		client.from("vendor_bills").select("*").eq("company_id", companyId).order("due_date"),
	);

const selectSubscriptions = async (client: SupabaseClient, companyId: string) =>
	selectRows<SubscriptionRow>(
		"subscriptions",
		client.from("subscriptions").select("*").eq("company_id", companyId).order("renewal_date"),
	);

const selectSpendRequests = async (client: SupabaseClient, companyId: string) =>
	selectRows<SpendRequestRow>(
		"spend_requests",
		client.from("spend_requests").select("*").eq("company_id", companyId).order("needed_by_date"),
	);

const mapSpendRequest = (request: SpendRequestRow) => ({
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

const updateSpendRequestStatusByCompanyId = async (
	client: SupabaseClient,
	companyId: string,
	id: string,
	status: Exclude<SpendRequestStatus, "pending">,
) => {
	const data = await getSupabaseQueryData(
		"spend_requests",
		client
			.from("spend_requests")
			.update({ status, updated_at: new Date().toISOString() })
			.eq("company_id", companyId)
			.eq("id", id)
			.select("*")
			.maybeSingle<SpendRequestRow>(),
		"Unable to update spend request.",
	);

	if (!data) {
		throw new SpendRequestNotFoundError();
	}

	return spendRequestSchema.parse(mapSpendRequest(data));
};

const selectTeamBudgets = async (client: SupabaseClient, companyId: string) =>
	selectRows<TeamBudgetRow>(
		"team_budgets",
		client.from("team_budgets").select("*").eq("company_id", companyId).order("team"),
	);

const selectCashActions = async (client: SupabaseClient, companyId: string) =>
	selectRows<CashActionRow>(
		"cash_actions",
		client.from("cash_actions").select("*").eq("company_id", companyId).order("due_date"),
	);

const selectForecast = async (client: SupabaseClient, companyId: string) =>
	selectRows<ForecastPointRow>(
		"forecast_points",
		client.from("forecast_points").select("*").eq("company_id", companyId).order("date"),
	);

const getDatasetByCompanyId = async (
	client: SupabaseClient,
	companyId: string,
	scope: WorkspaceDatasetScope,
): Promise<FinancialDataset> => {
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
		selectCompany(client, companyId),
		shouldLoadTable(scope, "teamMembers") ? selectTeamMembers(client, companyId) : EMPTY_DATASET_PARTS.teamMembers,
		shouldLoadTable(scope, "invoices") ? selectInvoices(client, companyId) : EMPTY_DATASET_PARTS.invoices,
		shouldLoadTable(scope, "vendorBills") ? selectVendorBills(client, companyId) : EMPTY_DATASET_PARTS.vendorBills,
		shouldLoadTable(scope, "subscriptions")
			? selectSubscriptions(client, companyId)
			: EMPTY_DATASET_PARTS.subscriptions,
		shouldLoadTable(scope, "spendRequests")
			? selectSpendRequests(client, companyId)
			: EMPTY_DATASET_PARTS.spendRequests,
		shouldLoadTable(scope, "teamBudgets") ? selectTeamBudgets(client, companyId) : EMPTY_DATASET_PARTS.teamBudgets,
		shouldLoadTable(scope, "cashActions") ? selectCashActions(client, companyId) : EMPTY_DATASET_PARTS.cashActions,
		shouldLoadTable(scope, "forecast") ? selectForecast(client, companyId) : EMPTY_DATASET_PARTS.forecast,
	]);

	const dataset = {
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
	};

	return financialDatasetSchema.parse(dataset);
};

export const supabaseFinanceRepository: FinanceRepository = {
	async getWorkspaceDataset(userId, accessToken, scope) {
		const client = createServerSupabaseClient({ accessToken });
		const companyId = await selectCompanyId(client, userId);

		return getDatasetByCompanyId(client, companyId, scope);
	},
	async updateSpendRequestStatus(userId, accessToken, id, status) {
		const client = createServerSupabaseClient({ accessToken });
		const companyId = await selectCompanyId(client, userId);

		return updateSpendRequestStatusByCompanyId(client, companyId, id, status);
	},
};
