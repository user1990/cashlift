import { beforeEach, describe, expect, it, vi } from "vitest";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";

const authMock = vi.hoisted(() => vi.fn());
const getDashboardDatasetMock = vi.hoisted(() => vi.fn());
const getDashboardDatasetByCompanyIdMock = vi.hoisted(() => vi.fn());

vi.mock("@clerk/nextjs/server", () => ({
	auth: authMock,
}));

vi.mock("@/modules/base/finance/repositories/supabase", () => {
	class CompanyMembershipNotFoundError extends Error {
		constructor() {
			super("No company workspace is assigned to this user.");
			this.name = "CompanyMembershipNotFoundError";
		}
	}

	return {
		CompanyMembershipNotFoundError,
		supabaseFinanceRepository: {
			getDashboardDataset: getDashboardDatasetMock,
			getDashboardDatasetByCompanyId: getDashboardDatasetByCompanyIdMock,
		},
	};
});

describe("resolveWorkspaceDataset", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it("returns demo dataset when demo mode is enabled", async () => {
		vi.stubEnv("CASHLIFT_APP_MODE", "demo");
		vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
		vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "anon");
		vi.stubEnv("SUPABASE_DEMO_COMPANY_ID", "demo-co");
		getDashboardDatasetByCompanyIdMock.mockResolvedValue(financialDatasetFixture);

		const { resolveWorkspaceDataset } = await import("./resolveWorkspaceDataset");
		const result = await resolveWorkspaceDataset();

		expect(result).toEqual({ dataset: financialDatasetFixture, kind: "success" });
		expect(getDashboardDatasetByCompanyIdMock).toHaveBeenCalledWith("demo-co");
		expect(authMock).not.toHaveBeenCalled();
	});

	it("returns forbidden when membership is missing", async () => {
		vi.stubEnv("CASHLIFT_APP_MODE", "production");
		vi.stubEnv("CLERK_SECRET_KEY", "secret");
		vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "pk");
		vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
		vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "anon");
		const { CompanyMembershipNotFoundError } = await import("@/modules/base/finance/repositories/supabase");
		authMock.mockResolvedValue({
			getToken: vi.fn().mockResolvedValue("jwt"),
			userId: "user-1",
		});
		getDashboardDatasetMock.mockRejectedValue(new CompanyMembershipNotFoundError());

		const { resolveWorkspaceDataset } = await import("./resolveWorkspaceDataset");
		const result = await resolveWorkspaceDataset();

		expect(result).toEqual({
			kind: "forbidden",
			message: "No company workspace is assigned to this user.",
		});
	});
});
