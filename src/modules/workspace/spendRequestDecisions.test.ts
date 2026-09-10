import { beforeEach, describe, expect, it, vi } from "vitest";
import { stubDemoWorkspaceEnv, stubProductionWorkspaceEnv } from "@/test/workspaceEnv";

const AUTH_MOCK = vi.hoisted(() => vi.fn());
const CAPTURE_APP_EXCEPTION_MOCK = vi.hoisted(() => vi.fn());
const CAPTURE_APP_MESSAGE_MOCK = vi.hoisted(() => vi.fn());
const CREATE_SERVER_SUPABASE_CLIENT_MOCK = vi.hoisted(() => vi.fn());
const UPDATE_SPEND_REQUEST_STATUS_MOCK = vi.hoisted(() => vi.fn());

vi.mock("@clerk/nextjs/server", () => ({ auth: (...args: unknown[]) => AUTH_MOCK(...args) }));

vi.mock("@/services/platform/integrations/sentry", () => ({
	captureAppException: CAPTURE_APP_EXCEPTION_MOCK,
	captureAppMessage: CAPTURE_APP_MESSAGE_MOCK,
}));

vi.mock("@/services/supabase/server", () => ({
	createServerSupabaseClient: CREATE_SERVER_SUPABASE_CLIENT_MOCK,
}));

vi.mock("./repositories/supabase", async (importOriginal) => {
	const original = await importOriginal<typeof import("./repositories/supabase")>();

	return {
		...original,
		supabaseFinanceRepository: {
			updateSpendRequestStatus: UPDATE_SPEND_REQUEST_STATUS_MOCK,
		},
	};
});

const decideRequest = async (input = { id: "request-brandforge", status: "approved" as const }) => {
	const { decideSpendRequest } = await import("./spendRequestDecisions");

	return decideSpendRequest(input);
};

const createSupabaseClient = ({
	companyMember = { company_id: "studio-nova", role: "owner-finance" },
	companyMemberError = null,
}: {
	companyMember?: { company_id: string; role: "employee" | "manager" | "owner-finance" } | null;
	companyMemberError?: { code?: string; message: string } | null;
} = {}) => ({
	from: vi.fn(() => ({
		select: () => ({
			eq: () => ({
				limit: () => ({
					maybeSingle: vi.fn().mockResolvedValue({ data: companyMember, error: companyMemberError }),
				}),
			}),
		}),
	})),
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
		expect(AUTH_MOCK).not.toHaveBeenCalled();
	});

	it("returns updated fixture request in demo mode", async () => {
		stubDemoWorkspaceEnv();

		const result = await decideRequest({ id: "request-webcam", status: "approved" });

		expect(result).toMatchObject({
			request: { id: "request-webcam", status: "approved" },
			status: "success",
		});
		expect(AUTH_MOCK).not.toHaveBeenCalled();
	});

	it("returns unauthenticated when no user is signed in", async () => {
		stubProductionWorkspaceEnv();
		AUTH_MOCK.mockResolvedValue({ getToken: vi.fn(), userId: null });

		const result = await decideRequest();

		expect(result).toEqual({
			code: "unauthenticated",
			message: "Sign in to update spend requests.",
			status: "error",
		});
		expect(CREATE_SERVER_SUPABASE_CLIENT_MOCK).not.toHaveBeenCalled();
	});

	it("updates the spend request when the member can approve spend", async () => {
		stubProductionWorkspaceEnv();
		const updatedRequest = { id: "request-brandforge", status: "approved" };
		const getToken = vi.fn().mockResolvedValue("jwt");
		AUTH_MOCK.mockResolvedValue({
			getToken,
			userId: "user-1",
		});
		CREATE_SERVER_SUPABASE_CLIENT_MOCK.mockReturnValue(createSupabaseClient());
		UPDATE_SPEND_REQUEST_STATUS_MOCK.mockResolvedValue(updatedRequest);

		const result = await decideRequest();

		expect(result).toEqual({ request: updatedRequest, status: "success" });
		expect(getToken).toHaveBeenCalledWith();
		expect(CREATE_SERVER_SUPABASE_CLIENT_MOCK).toHaveBeenCalledWith({ accessToken: "jwt" });
		expect(UPDATE_SPEND_REQUEST_STATUS_MOCK).toHaveBeenCalledWith(
			"studio-nova",
			"jwt",
			"request-brandforge",
			"approved",
		);
	});

	it("returns forbidden when the member is not an approver", async () => {
		stubProductionWorkspaceEnv();
		AUTH_MOCK.mockResolvedValue({
			getToken: vi.fn().mockResolvedValue("jwt"),
			userId: "user-1",
		});
		CREATE_SERVER_SUPABASE_CLIENT_MOCK.mockReturnValue(
			createSupabaseClient({ companyMember: { company_id: "studio-nova", role: "employee" } }),
		);

		const result = await decideRequest();

		expect(result).toEqual({
			code: "forbidden",
			message: "Only finance leads and managers can decide spend requests.",
			status: "error",
		});
		expect(UPDATE_SPEND_REQUEST_STATUS_MOCK).not.toHaveBeenCalled();
	});

	it("captures production write failures", async () => {
		stubProductionWorkspaceEnv();
		AUTH_MOCK.mockResolvedValue({
			getToken: vi.fn().mockResolvedValue("jwt"),
			userId: "user-1",
		});
		CREATE_SERVER_SUPABASE_CLIENT_MOCK.mockReturnValue(createSupabaseClient());
		UPDATE_SPEND_REQUEST_STATUS_MOCK.mockRejectedValue(new Error("permission denied"));
		CAPTURE_APP_EXCEPTION_MOCK.mockReturnValue("event-id");

		const result = await decideRequest();

		expect(result).toEqual({
			code: "unavailable",
			message: "Unable to update spend request.",
			requestId: "event-id",
			status: "error",
		});
		expect(CAPTURE_APP_EXCEPTION_MOCK).toHaveBeenCalledWith(
			expect.objectContaining({
				fingerprint: ["spend-request-decision", "data-error"],
			}),
		);
	});
});
