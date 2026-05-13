import { beforeEach, describe, expect, it, vi } from "vitest";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";

const mocks = vi.hoisted(() => ({
	resolveWorkspaceDataset: vi.fn(),
}));

vi.mock("@/modules/base/finance/resolveWorkspaceDataset", () => ({
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
			{ error: "Workspace production environment variables are not configured." },
		],
		[
			503,
			{ kind: "service" as const, message: "Workspace data token is not configured." },
			{ error: "Workspace data token is not configured." },
		],
		[
			401,
			{ kind: "unauthenticated" as const, message: "Sign in to load workspace data." },
			{ error: "Sign in to load workspace data." },
		],
		[
			403,
			{
				kind: "forbidden" as const,
				message: "No company workspace is assigned to this user.",
			},
			{ error: "No company workspace is assigned to this user." },
		],
		[
			500,
			{ kind: "data_error" as const, message: "Unable to load workspace data." },
			{ error: "Unable to load workspace data." },
		],
	])("returns %s with mapped error body", async (status, resolved, body) => {
		mocks.resolveWorkspaceDataset.mockResolvedValue(resolved);
		const { GET } = await import("./route");
		const response = await GET();

		expect(response.status).toEqual(status);
		await expect(response.json()).resolves.toEqual(body);
	});

	it("returns 200 with dataset on success", async () => {
		mocks.resolveWorkspaceDataset.mockResolvedValue({
			dataset: financialDatasetFixture,
			kind: "success",
		});
		const { GET } = await import("./route");

		const response = await GET();

		expect(response.status).toEqual(200);
		await expect(response.json()).resolves.toMatchObject({ profile: { companyId: "studio-nova" } });
	});
});
