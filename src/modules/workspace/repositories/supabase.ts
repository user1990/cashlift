import type { SupabaseClient } from "@supabase/supabase-js";
import { selectCompanyId } from "@/modules/company-memberships/repositories/supabase";
import { SPEND_REQUEST_SCHEMA } from "@/modules/spend-requests/schemas";
import type { SpendRequestStatus } from "@/modules/spend-requests/types";
import { createServerSupabaseClient } from "@/services/supabase/server";
import { AppError } from "@/utilities/errors/AppError";
import type { FinanceRepository } from "../api";
import { WORKSPACE_SCOPE_TABLES } from "../read-models";
import { FINANCIAL_DATASET_SCHEMA } from "../schemas";
import type { FinancialDataset, WorkspaceDatasetScope } from "../types";
import {
	type CashActionRow,
	type CompanyRow,
	type ForecastPointRow,
	type InvoiceRow,
	mapFinancialDataset,
	mapSpendRequest,
	type SpendRequestRow,
	type SubscriptionRow,
	type TeamBudgetRow,
	type TeamMemberRow,
	type VendorBillRow,
} from "./supabaseMappers";

type SupabaseQueryError = {
	message: string;
	code?: string;
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

const shouldLoadTable = (scope: WorkspaceDatasetScope, table: DatasetTable) =>
	(WORKSPACE_SCOPE_TABLES[scope] as readonly DatasetTable[]).includes(table);

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

	return SPEND_REQUEST_SCHEMA.parse(mapSpendRequest(data));
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

	const dataset = mapFinancialDataset({
		cashActions,
		company,
		forecast,
		invoices,
		spendRequests,
		subscriptions,
		teamBudgets,
		teamMembers,
		vendorBills,
	});

	return FINANCIAL_DATASET_SCHEMA.parse(dataset);
};

export const supabaseFinanceRepository: FinanceRepository = {
	async getWorkspaceDataset(userId, accessToken, scope) {
		const client = createServerSupabaseClient({ accessToken });
		const companyId = await selectCompanyId(client, userId);

		return getDatasetByCompanyId(client, companyId, scope);
	},
	async updateSpendRequestStatus(companyId, accessToken, id, status) {
		const client = createServerSupabaseClient({ accessToken });

		return updateSpendRequestStatusByCompanyId(client, companyId, id, status);
	},
};
