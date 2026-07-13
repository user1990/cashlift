import { beforeEach, describe, expect, it, vi } from "vitest";
import { stubDemoWorkspaceEnv, stubProductionWorkspaceEnv } from "@/test/workspaceEnv";
import { demoWorkspaceDataset } from "./demoDataset";

const authMock = vi.hoisted(() => vi.fn());
const captureAppExceptionMock = vi.hoisted(() => vi.fn(() => "event-exception-id"));
const captureAppMessageMock = vi.hoisted(() => vi.fn(() => "event-message-id"));
const getWorkspaceDatasetMock = vi.hoisted(() => vi.fn());

vi.mock("@clerk/nextjs/server", () => ({
	auth: authMock,
}));

vi.mock("@/services/platform/integrations/sentry", () => ({
	captureAppException: captureAppExceptionMock,
	captureAppMessage: captureAppMessageMock,
}));

vi.mock("@/modules/workspace/repositories/supabase", () => ({
	supabaseFinanceRepository: {
		getWorkspaceDataset: getWorkspaceDatasetMock,
	},
}));

const resolveDataset = async () => {
	const { resolveWorkspaceDataset } = await import("./resolveWorkspaceDataset");

	return resolveWorkspaceDataset();
};

const resolveVendorsDataset = async () => {
	const { resolveWorkspaceDataset } = await import("./resolveWorkspaceDataset");

	return resolveWorkspaceDataset("vendors");
};

const expectDataErrorResult = (result: unknown) => {
	expect(result).toEqual({
		kind: "data_error",
		message: "Unable to load workspace data.",
		requestId: "event-exception-id",
	});
};

const expectWorkspaceExceptionCaptured = ({
	error,
	extra,
	failureKind,
}: {
	error: Error;
	extra: Record<string, string>;
	failureKind: string;
}) => {
	expect(captureAppExceptionMock).toHaveBeenCalledWith({
		error,
		extra,
		fingerprint: ["workspace-dataset", failureKind],
		tags: {
			failureKind,
			feature: "workspace-dataset",
		},
	});
};

describe("resolveWorkspaceDataset", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it("returns demo dataset when demo mode is enabled", async () => {
		stubDemoWorkspaceEnv();

		const result = await resolveDataset();

		expect(result).toEqual({ dataset: demoWorkspaceDataset, kind: "success" });
		expect(getWorkspaceDatasetMock).not.toHaveBeenCalled();
		expect(captureAppExceptionMock).not.toHaveBeenCalled();
		expect(captureAppMessageMock).not.toHaveBeenCalled();
		expect(authMock).not.toHaveBeenCalled();
	});

	it("returns scoped demo data for non-overview pages", async () => {
		stubDemoWorkspaceEnv();

		const result = await resolveVendorsDataset();

		expect(result).toEqual({
			dataset: {
				...demoWorkspaceDataset,
				cashActions: [],
				forecast: [],
				invoices: [],
				spendRequests: [],
				teamBudgets: [],
				teamMembers: [],
				vendorBills: [],
			},
			kind: "success",
		});
	});

	it("passes the requested scope to production data loading", async () => {
		stubProductionWorkspaceEnv();
		authMock.mockResolvedValue({
			getToken: vi.fn().mockResolvedValue("jwt"),
			userId: "user-1",
		});
		getWorkspaceDatasetMock.mockResolvedValue(demoWorkspaceDataset);

		const result = await resolveVendorsDataset();

		expect(result).toEqual({ dataset: demoWorkspaceDataset, kind: "success" });
		expect(getWorkspaceDatasetMock).toHaveBeenCalledWith("user-1", "jwt", "vendors");
	});

	it("returns config failures without Sentry capture", async () => {
		vi.stubEnv("CASHLIFT_APP_MODE", "production");

		const result = await resolveDataset();

		expect(result).toEqual({
			kind: "config",
			message: "Workspace production environment variables are not configured.",
		});
		expect(captureAppMessageMock).not.toHaveBeenCalled();
	});

	it("returns forbidden when membership is missing", async () => {
		stubProductionWorkspaceEnv();
		const { CompanyMembershipNotFoundError } = await import("@/modules/company-memberships/repositories/supabase");
		authMock.mockResolvedValue({
			getToken: vi.fn().mockResolvedValue("jwt"),
			userId: "user-1",
		});
		getWorkspaceDatasetMock.mockRejectedValue(new CompanyMembershipNotFoundError());

		const result = await resolveDataset();

		expect(result).toEqual({
			kind: "forbidden",
			message: "No company workspace is assigned to this user.",
		});
		expect(captureAppExceptionMock).not.toHaveBeenCalled();
		expect(captureAppMessageMock).not.toHaveBeenCalled();
	});

	it("reports an unavailable data token when the Clerk Supabase template fails", async () => {
		stubProductionWorkspaceEnv();
		const error = new Error("JWT template supabase is not configured");
		authMock.mockResolvedValue({
			getToken: vi.fn().mockRejectedValue(error),
			userId: "user-1",
		});

		const result = await resolveDataset();

		expect(result).toEqual({
			kind: "service",
			message: "Workspace data token is unavailable.",
			requestId: "event-exception-id",
		});
		expectWorkspaceExceptionCaptured({
			error,
			extra: { userId: "user-1" },
			failureKind: "data-token-error",
		});
	});

	it("captures authenticated data failures", async () => {
		stubProductionWorkspaceEnv();
		const error = new Error("Supabase failed");
		authMock.mockResolvedValue({
			getToken: vi.fn().mockResolvedValue("jwt"),
			userId: "user-1",
		});
		getWorkspaceDatasetMock.mockRejectedValue(error);

		const result = await resolveDataset();

		expectDataErrorResult(result);
		expectWorkspaceExceptionCaptured({
			error,
			extra: { userId: "user-1" },
			failureKind: "data-error",
		});
	});
});
