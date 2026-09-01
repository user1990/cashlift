import { beforeEach, describe, expect, it, vi } from "vitest";
import { stubDemoWorkspaceEnv, stubProductionWorkspaceEnv } from "@/test/workspaceEnv";
import { DEMO_WORKSPACE_DATASET } from "./demoDataset";

const AUTH_MOCK = vi.hoisted(() => vi.fn());
const CAPTURE_APP_EXCEPTION_MOCK = vi.hoisted(() => vi.fn(() => "event-exception-id"));
const CAPTURE_APP_MESSAGE_MOCK = vi.hoisted(() => vi.fn(() => "event-message-id"));
const GET_WORKSPACE_DATASET_MOCK = vi.hoisted(() => vi.fn());

vi.mock("@clerk/nextjs/server", () => ({
	auth: AUTH_MOCK,
}));

vi.mock("@/services/platform/integrations/sentry", () => ({
	captureAppException: CAPTURE_APP_EXCEPTION_MOCK,
	captureAppMessage: CAPTURE_APP_MESSAGE_MOCK,
}));

vi.mock("@/modules/workspace/repositories/supabase", () => ({
	supabaseFinanceRepository: {
		getWorkspaceDataset: GET_WORKSPACE_DATASET_MOCK,
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
	failureKind,
	extra,
}: {
	error: Error;
	failureKind: string;
	extra?: Record<string, string>;
}) => {
	expect(CAPTURE_APP_EXCEPTION_MOCK).toHaveBeenCalledWith({
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

		expect(result).toEqual({ dataset: DEMO_WORKSPACE_DATASET, kind: "success" });
		expect(GET_WORKSPACE_DATASET_MOCK).not.toHaveBeenCalled();
		expect(CAPTURE_APP_EXCEPTION_MOCK).not.toHaveBeenCalled();
		expect(CAPTURE_APP_MESSAGE_MOCK).not.toHaveBeenCalled();
		expect(AUTH_MOCK).not.toHaveBeenCalled();
	});

	it("returns scoped demo data for non-overview pages", async () => {
		stubDemoWorkspaceEnv();

		const result = await resolveVendorsDataset();

		expect(result).toEqual({
			dataset: {
				...DEMO_WORKSPACE_DATASET,
				cashActions: [],
				forecast: [],
				invoices: [],
				spendRequests: [],
				teamBudgets: [],
				teamMembers: [],
			},
			kind: "success",
		});
	});

	it("passes the requested scope to production data loading", async () => {
		stubProductionWorkspaceEnv();
		const getToken = vi.fn().mockResolvedValue("jwt");
		AUTH_MOCK.mockResolvedValue({
			getToken,
			userId: "user-1",
		});
		GET_WORKSPACE_DATASET_MOCK.mockResolvedValue(DEMO_WORKSPACE_DATASET);

		const result = await resolveVendorsDataset();

		expect(result).toEqual({ dataset: DEMO_WORKSPACE_DATASET, kind: "success" });
		expect(getToken).toHaveBeenCalledWith();
		expect(GET_WORKSPACE_DATASET_MOCK).toHaveBeenCalledWith("user-1", "jwt", "vendors");
	});

	it("returns config failures without Sentry capture", async () => {
		vi.stubEnv("CASHLIFT_APP_MODE", "production");

		const result = await resolveDataset();

		expect(result).toEqual({
			kind: "config",
			message: "Workspace production environment variables are not configured.",
		});
		expect(CAPTURE_APP_MESSAGE_MOCK).not.toHaveBeenCalled();
	});

	it("returns forbidden when membership is missing", async () => {
		stubProductionWorkspaceEnv();
		const { CompanyMembershipNotFoundError } = await import("@/modules/company-memberships/repositories/supabase");
		AUTH_MOCK.mockResolvedValue({
			getToken: vi.fn().mockResolvedValue("jwt"),
			userId: "user-1",
		});
		GET_WORKSPACE_DATASET_MOCK.mockRejectedValue(new CompanyMembershipNotFoundError());

		const result = await resolveDataset();

		expect(result).toEqual({
			kind: "forbidden",
			message: "No company workspace is assigned to this user.",
		});
		expect(CAPTURE_APP_EXCEPTION_MOCK).not.toHaveBeenCalled();
		expect(CAPTURE_APP_MESSAGE_MOCK).not.toHaveBeenCalled();
	});

	it("reports an unavailable data token when Clerk token retrieval fails", async () => {
		stubProductionWorkspaceEnv();
		const error = new Error("Clerk session token is unavailable");
		AUTH_MOCK.mockResolvedValue({
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
			extra: undefined,
			failureKind: "data-token-error",
		});
	});

	it("captures authenticated data failures", async () => {
		stubProductionWorkspaceEnv();
		const error = new Error("Supabase failed");
		AUTH_MOCK.mockResolvedValue({
			getToken: vi.fn().mockResolvedValue("jwt"),
			userId: "user-1",
		});
		GET_WORKSPACE_DATASET_MOCK.mockRejectedValue(error);

		const result = await resolveDataset();

		expectDataErrorResult(result);
		expectWorkspaceExceptionCaptured({
			error,
			extra: undefined,
			failureKind: "data-error",
		});
	});
});
