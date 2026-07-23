import { beforeEach, describe, expect, it, vi } from "vitest";
import { stubDemoWorkspaceEnv, stubProductionWorkspaceEnv } from "@/test/workspaceEnv";

const authMock = vi.hoisted(() => vi.fn());
const captureAppExceptionMock = vi.hoisted(() => vi.fn());
const captureAppMessageMock = vi.hoisted(() => vi.fn());
const createServerSupabaseClientMock = vi.hoisted(() => vi.fn());
const updateSpendRequestStatusMock = vi.hoisted(() => vi.fn());

vi.mock("@clerk/nextjs/server", () => ({ auth: (...args: unknown[]) => authMock(...args) }));

vi.mock("@/services/platform/integrations/sentry", () => ({
	captureAppException: captureAppExceptionMock,
	captureAppMessage: captureAppMessageMock,
}));

vi.mock("@/services/supabase/server", () => ({
	createServerSupabaseClient: createServerSupabaseClientMock,
}));

vi.mock("./repositories/supabase", async (importOriginal) => {
	const original = await importOriginal<typeof import("./repositories/supabase")>();

	return {
		...original,
		supabaseFinanceRepository: {
			updateSpendRequestStatus: updateSpendRequestStatusMock,
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
		expect(authMock).not.toHaveBeenCalled();
	});

	it("returns updated fixture request in demo mode", async () => {
		stubDemoWorkspaceEnv();

		const result = await decideRequest({ id: "request-webcam", status: "approved" });

		expect(result).toMatchObject({
			request: { id: "request-webcam", status: "approved" },
			status: "success",
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

	it("updates the spend request when the member can approve spend", async () => {
		stubProductionWorkspaceEnv();
		const updatedRequest = { id: "request-brandforge", status: "approved" };
		const getToken = vi.fn().mockResolvedValue("jwt");
		authMock.mockResolvedValue({
			getToken,
			userId: "user-1",
		});
		createServerSupabaseClientMock.mockReturnValue(createSupabaseClient());
		updateSpendRequestStatusMock.mockResolvedValue(updatedRequest);

		const result = await decideRequest();

		expect(result).toEqual({ request: updatedRequest, status: "success" });
		expect(getToken).toHaveBeenCalledWith();
		expect(createServerSupabaseClientMock).toHaveBeenCalledWith({ accessToken: "jwt" });
		expect(updateSpendRequestStatusMock).toHaveBeenCalledWith("studio-nova", "jwt", "request-brandforge", "approved");
	});

	it("returns forbidden when the member is not an approver", async () => {
		stubProductionWorkspaceEnv();
		authMock.mockResolvedValue({
			getToken: vi.fn().mockResolvedValue("jwt"),
			userId: "user-1",
		});
		createServerSupabaseClientMock.mockReturnValue(
			createSupabaseClient({ companyMember: { company_id: "studio-nova", role: "employee" } }),
		);

		const result = await decideRequest();

		expect(result).toEqual({
			code: "forbidden",
			message: "Only finance leads and managers can decide spend requests.",
			status: "error",
		});
		expect(updateSpendRequestStatusMock).not.toHaveBeenCalled();
	});

	it("captures production write failures", async () => {
		stubProductionWorkspaceEnv();
		authMock.mockResolvedValue({
			getToken: vi.fn().mockResolvedValue("jwt"),
			userId: "user-1",
		});
		createServerSupabaseClientMock.mockReturnValue(createSupabaseClient());
		updateSpendRequestStatusMock.mockRejectedValue(new Error("permission denied"));

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
