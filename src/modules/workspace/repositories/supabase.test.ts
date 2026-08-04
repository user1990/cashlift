import { beforeEach, describe, expect, it, vi } from "vitest";

const CREATE_SERVER_SUPABASE_CLIENT_MOCK = vi.hoisted(() => vi.fn());

vi.mock("@/services/supabase/server", () => ({
	createServerSupabaseClient: CREATE_SERVER_SUPABASE_CLIENT_MOCK,
}));

const UPDATED_SPEND_REQUEST_ROW_MOCK = {
	amount_cents: 680_000,
	category: "software",
	id: "request-brandforge",
	needed_by_date: "2026-05-09",
	reason: "Annual creative suite for retained client work",
	requested_date: "2026-05-07",
	requester: "Leo",
	status: "approved",
	team: "Creative",
	vendor: "BrandForge",
};

const COMPANY_ROW_MOCK = {
	cash_balance_cents: 41_200_000,
	cash_buffer_target_cents: 25_000_000,
	default_role: "owner-finance" as const,
	id: "studio-nova",
	industry: "agency" as const,
	monthly_payroll_cents: 17_800_000,
	name: "Studio Nova",
};

const SUBSCRIPTION_ROWS_MOCK = [
	{
		amount_cents: 126_000,
		id: "subscription-notion",
		owner: "Leo",
		renewal_date: "2026-05-12",
		status: "unused" as const,
		usage_percent: 31,
		vendor: "Notion",
	},
];

const createSupabaseClient = ({
	updateError = null,
	updatedRequest = UPDATED_SPEND_REQUEST_ROW_MOCK,
}: {
	updateError?: { code?: string; message: string } | null;
	updatedRequest?: typeof UPDATED_SPEND_REQUEST_ROW_MOCK | null;
} = {}) => {
	const eqMock = vi.fn(() => ({
		eq: eqMock,
		limit: () => ({
			maybeSingle: vi
				.fn()
				.mockResolvedValue({ data: { company_id: "studio-nova", role: "owner-finance" }, error: null }),
		}),
		select: () => ({
			maybeSingle: vi.fn().mockResolvedValue({ data: updatedRequest, error: updateError }),
		}),
	}));
	const updateMock = vi.fn(() => ({ eq: eqMock }));
	const selectMock = vi.fn(() => ({ eq: eqMock }));

	return {
		eqMock,
		from: vi.fn((table: string) => {
			if (table === "company_members") {
				return { select: selectMock };
			}

			return { update: updateMock };
		}),
		updateMock,
	};
};

const createWorkspaceDatasetClient = () => ({
	from: vi.fn((table: string) => {
		if (table === "company_members") {
			return {
				select: () => ({
					eq: () => ({
						limit: () => ({
							maybeSingle: vi
								.fn()
								.mockResolvedValue({ data: { company_id: "studio-nova", role: "owner-finance" }, error: null }),
						}),
					}),
				}),
			};
		}

		if (table === "companies") {
			return {
				select: () => ({
					eq: () => ({
						single: vi.fn().mockResolvedValue({ data: COMPANY_ROW_MOCK, error: null }),
					}),
				}),
			};
		}

		if (table === "subscriptions") {
			return {
				select: () => ({
					eq: () => ({
						order: vi.fn().mockResolvedValue({ data: SUBSCRIPTION_ROWS_MOCK, error: null }),
					}),
				}),
			};
		}

		throw new Error(`Unexpected workspace table: ${table}`);
	}),
});

describe("supabaseFinanceRepository", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it("updates a spend request only inside the authenticated company", async () => {
		const client = createSupabaseClient();
		CREATE_SERVER_SUPABASE_CLIENT_MOCK.mockReturnValue(client);
		const { supabaseFinanceRepository } = await import("./supabase");

		const request = await supabaseFinanceRepository.updateSpendRequestStatus(
			"studio-nova",
			"jwt",
			"request-brandforge",
			"approved",
		);

		expect(CREATE_SERVER_SUPABASE_CLIENT_MOCK).toHaveBeenCalledWith({ accessToken: "jwt" });
		expect(client.from).toHaveBeenCalledWith("spend_requests");
		expect(client.updateMock).toHaveBeenCalledWith(expect.objectContaining({ status: "approved" }));
		expect(client.eqMock).toHaveBeenCalledWith("company_id", "studio-nova");
		expect(client.eqMock).toHaveBeenCalledWith("id", "request-brandforge");
		expect(request).toEqual({
			amountCents: 680_000,
			category: "software",
			id: "request-brandforge",
			neededByDate: "2026-05-09",
			reason: "Annual creative suite for retained client work",
			requestedDate: "2026-05-07",
			requester: "Leo",
			status: "approved",
			team: "Creative",
			vendor: "BrandForge",
		});
	});

	it("maps Supabase update failures to AppError", async () => {
		CREATE_SERVER_SUPABASE_CLIENT_MOCK.mockReturnValue(
			createSupabaseClient({ updateError: { code: "42501", message: "permission denied" } }),
		);
		const { supabaseFinanceRepository } = await import("./supabase");

		await expect(
			supabaseFinanceRepository.updateSpendRequestStatus("studio-nova", "jwt", "request-brandforge", "approved"),
		).rejects.toMatchObject({
			code: "supabase_query_failed",
			message: "Unable to update spend request.",
		});
	});

	it("returns a scope-limited dataset through its public read interface", async () => {
		const client = createWorkspaceDatasetClient();
		CREATE_SERVER_SUPABASE_CLIENT_MOCK.mockReturnValue(client);
		const { supabaseFinanceRepository } = await import("./supabase");

		const dataset = await supabaseFinanceRepository.getWorkspaceDataset("user-1", "jwt", "vendors");

		expect(CREATE_SERVER_SUPABASE_CLIENT_MOCK).toHaveBeenCalledWith({ accessToken: "jwt" });
		expect(client.from).toHaveBeenCalledWith("company_members");
		expect(client.from).toHaveBeenCalledWith("companies");
		expect(client.from).toHaveBeenCalledWith("subscriptions");
		expect(client.from).toHaveBeenCalledTimes(3);
		expect(dataset).toEqual({
			cashActions: [],
			forecast: [],
			invoices: [],
			profile: {
				cashBalanceCents: 41_200_000,
				cashBufferTargetCents: 25_000_000,
				companyId: "studio-nova",
				defaultRole: "owner-finance",
				industry: "agency",
				monthlyPayrollCents: 17_800_000,
				name: "Studio Nova",
			},
			spendRequests: [],
			subscriptions: [
				{
					amountCents: 126_000,
					id: "subscription-notion",
					owner: "Leo",
					renewalDate: "2026-05-12",
					status: "unused",
					usagePercent: 31,
					vendor: "Notion",
				},
			],
			teamBudgets: [],
			teamMembers: [],
			vendorBills: [],
		});
	});
});
