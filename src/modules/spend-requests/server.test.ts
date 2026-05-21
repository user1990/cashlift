import { beforeEach, describe, expect, it, vi } from "vitest";

const authMock = vi.hoisted(() => vi.fn());
const captureAppExceptionMock = vi.hoisted(() => vi.fn());
const captureAppMessageMock = vi.hoisted(() => vi.fn());
const createServerSupabaseClientMock = vi.hoisted(() => vi.fn());

vi.mock("@clerk/nextjs/server", () => ({
	auth: authMock,
}));

vi.mock("@/services/platform/integrations/sentry", () => ({
	captureAppException: captureAppExceptionMock,
	captureAppMessage: captureAppMessageMock,
}));

vi.mock("@/services/supabase/server", () => ({
	createServerSupabaseClient: createServerSupabaseClientMock,
}));

const stubProductionWorkspaceEnv = () => {
	vi.stubEnv("CASHLIFT_APP_MODE", "production");
	vi.stubEnv("CLERK_SECRET_KEY", "secret");
	vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "pk");
	vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
	vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "anon");
};

const decideRequest = async (input = { id: "request-brandforge", status: "approved" as const }) => {
	const { decideSpendRequest } = await import("./server");

	return decideSpendRequest(input);
};

const createSupabaseClient = ({
	companyMember = { company_id: "studio-nova" },
	updateError = null,
	updatedRequest = { id: "request-brandforge" },
}: {
	companyMember?: { company_id: string } | null;
	updateError?: { code?: string; message: string } | null;
	updatedRequest?: { id: string } | null;
} = {}) => ({
	from: vi.fn((table: string) => {
		if (table === "company_members") {
			return {
				select: () => ({
					eq: () => ({
						limit: () => ({
							maybeSingle: vi.fn().mockResolvedValue({ data: companyMember, error: null }),
						}),
					}),
				}),
			};
		}

		return {
			update: vi.fn(() => ({
				eq: () => ({
					eq: () => ({
						select: () => ({
							maybeSingle: vi.fn().mockResolvedValue({ data: updatedRequest, error: updateError }),
						}),
					}),
				}),
			})),
		};
	}),
});

describe("decideSpendRequest", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it("returns invalid when decision input fails validation", async () => {
		stubProductionWorkspaceEnv();

		const result = await decideRequest({ id: "", status: "approved" });

		expect(result).toEqual({
			code: "invalid",
			message: "Spend request decision is invalid.",
			status: "error",
		});
		expect(authMock).not.toHaveBeenCalled();
	});

	it("returns unauthenticated when no user is signed in", async () => {
		stubProductionWorkspaceEnv();
		authMock.mockResolvedValue({ getToken: vi.fn(), userId: null });

		const result = await decideRequest();

		expect(result).toEqual({
			code: "unauthenticated",
			message: "Sign in to update spend requests.",
			status: "error",
		});
		expect(createServerSupabaseClientMock).not.toHaveBeenCalled();
	});

	it("updates the spend request for the authenticated company", async () => {
		stubProductionWorkspaceEnv();
		const client = createSupabaseClient();
		authMock.mockResolvedValue({
			getToken: vi.fn().mockResolvedValue("jwt"),
			userId: "user-1",
		});
		createServerSupabaseClientMock.mockReturnValue(client);

		const result = await decideRequest();

		expect(result).toEqual({ refresh: true, status: "success" });
		expect(createServerSupabaseClientMock).toHaveBeenCalledWith({ accessToken: "jwt" });
		expect(client.from).toHaveBeenCalledWith("company_members");
		expect(client.from).toHaveBeenCalledWith("spend_requests");
	});

	it("returns forbidden when company membership is missing", async () => {
		stubProductionWorkspaceEnv();
		authMock.mockResolvedValue({
			getToken: vi.fn().mockResolvedValue("jwt"),
			userId: "user-1",
		});
		createServerSupabaseClientMock.mockReturnValue(createSupabaseClient({ companyMember: null }));

		const result = await decideRequest();

		expect(result).toEqual({
			code: "forbidden",
			message: "No company workspace is assigned to this user.",
			status: "error",
		});
	});

	it("captures Supabase write failures", async () => {
		stubProductionWorkspaceEnv();
		authMock.mockResolvedValue({
			getToken: vi.fn().mockResolvedValue("jwt"),
			userId: "user-1",
		});
		createServerSupabaseClientMock.mockReturnValue(
			createSupabaseClient({ updateError: { code: "42501", message: "permission denied" } }),
		);

		const result = await decideRequest();

		expect(result).toEqual({
			code: "unavailable",
			message: "Unable to update spend request.",
			status: "error",
		});
		expect(captureAppExceptionMock).toHaveBeenCalledWith(
			expect.objectContaining({
				fingerprint: ["spend-request-decision", "data-error"],
			}),
		);
	});
});
