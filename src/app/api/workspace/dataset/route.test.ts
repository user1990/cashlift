import { beforeEach, describe, expect, it, vi } from "vitest";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";

const mocks = vi.hoisted(() => ({
	resolveWorkspaceDataset: vi.fn(),
}));

vi.mock("@/modules/workspace/resolveWorkspaceDataset", () => ({
	resolveWorkspaceDataset: mocks.resolveWorkspaceDataset,
}));

describe("GET /api/workspace/dataset", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it.each([
		[
			503,
			{
				kind: "config" as const,
				message: "Workspace production environment variables are not configured.",
			},
			{
				code: "workspace_config_unavailable",
				error: "Workspace production environment variables are not configured.",
			},
		],
		[
			503,
			{ kind: "service" as const, message: "Workspace data token is not configured." },
			{
				code: "workspace_service_unavailable",
				error: "Workspace data token is not configured.",
			},
		],
		[
			401,
			{ kind: "unauthenticated" as const, message: "Sign in to load workspace data." },
			{
				code: "workspace_unauthenticated",
				error: "Sign in to load workspace data.",
			},
		],
		[
			403,
			{
				kind: "forbidden" as const,
				message: "No company workspace is assigned to this user.",
			},
			{
				code: "workspace_forbidden",
				error: "No company workspace is assigned to this user.",
			},
		],
		[
			500,
			{ kind: "data_error" as const, message: "Unable to load workspace data." },
			{
				code: "workspace_data_unavailable",
				error: "Unable to load workspace data.",
			},
		],
	])("returns %s with mapped error body", async (status, resolved, body) => {
		mocks.resolveWorkspaceDataset.mockResolvedValue(resolved);
		const { GET } = await import("./route");
		const response = await GET(new Request("https://example.com/api/workspace/dataset"));

		expect(response.status).toEqual(status);
		await expect(response.json()).resolves.toEqual(body);
	});

	it("returns 200 with dataset on success", async () => {
		mocks.resolveWorkspaceDataset.mockResolvedValue({
			dataset: financialDatasetFixture,
			kind: "success",
		});
		const { GET } = await import("./route");

		const response = await GET(new Request("https://example.com/api/workspace/dataset"));

		expect(response.status).toEqual(200);
		await expect(response.json()).resolves.toMatchObject({ profile: { companyId: "studio-nova" } });
	});

	it("includes request ids for reported workspace failures", async () => {
		mocks.resolveWorkspaceDataset.mockResolvedValue({
			kind: "data_error",
			message: "Unable to load workspace data.",
			requestId: "event-id",
		});
		const { GET } = await import("./route");

		const response = await GET(new Request("https://example.com/api/workspace/dataset"));

		expect(response.status).toEqual(500);
		await expect(response.json()).resolves.toEqual({
			code: "workspace_data_unavailable",
			error: "Unable to load workspace data.",
			requestId: "event-id",
		});
	});

	it("passes requested scope to the workspace resolver", async () => {
		mocks.resolveWorkspaceDataset.mockResolvedValue({
			dataset: financialDatasetFixture,
			kind: "success",
		});
		const { GET } = await import("./route");

		await GET(new Request("https://example.com/api/workspace/dataset?scope=approvals"));

		expect(mocks.resolveWorkspaceDataset).toHaveBeenCalledWith("approvals");
	});

	it("returns 400 when scope is invalid", async () => {
		const { GET } = await import("./route");

		const response = await GET(new Request("https://example.com/api/workspace/dataset?scope=unknown"));

		expect(response.status).toEqual(400);
		await expect(response.json()).resolves.toEqual({
			code: "api_request_failed",
			error: "Workspace dataset scope is invalid.",
		});
		expect(mocks.resolveWorkspaceDataset).not.toHaveBeenCalled();
	});
});
