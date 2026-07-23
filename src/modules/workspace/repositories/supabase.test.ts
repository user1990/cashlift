import { beforeEach, describe, expect, it, vi } from "vitest";

const createServerSupabaseClientMock = vi.hoisted(() => vi.fn());

vi.mock("@/services/supabase/server", () => ({
	createServerSupabaseClient: createServerSupabaseClientMock,
}));

const updatedSpendRequestRow = {
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

const createSupabaseClient = ({
	updateError = null,
	updatedRequest = updatedSpendRequestRow,
}: {
	updateError?: { code?: string; message: string } | null;
	updatedRequest?: typeof updatedSpendRequestRow | null;
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

describe("supabaseFinanceRepository", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it("updates a spend request only inside the authenticated company", async () => {
		const client = createSupabaseClient();
		createServerSupabaseClientMock.mockReturnValue(client);
		const { supabaseFinanceRepository } = await import("./supabase");

		const request = await supabaseFinanceRepository.updateSpendRequestStatus(
			"studio-nova",
			"jwt",
			"request-brandforge",
			"approved",
		);

		expect(createServerSupabaseClientMock).toHaveBeenCalledWith({ accessToken: "jwt" });
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
		createServerSupabaseClientMock.mockReturnValue(
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
});
