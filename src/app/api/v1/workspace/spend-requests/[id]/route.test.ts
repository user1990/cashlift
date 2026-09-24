import { beforeEach, describe, expect, it, vi } from "vitest";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";

const mocks = vi.hoisted(() => ({
	decideSpendRequest: vi.fn(),
}));

vi.mock("@/modules/workspace/spendRequestDecisions", () => ({
	decideSpendRequest: mocks.decideSpendRequest,
}));

const patchRequest = async (body: unknown = { status: "approved" }) => {
	const { PATCH } = await import("./route");

	return PATCH(
		new Request("https://example.com/api/v1/workspace/spend-requests/request-brandforge", {
			body: JSON.stringify(body),
			method: "PATCH",
		}),
		{ params: Promise.resolve({ id: "request-brandforge" }) },
	);
};

describe("PATCH /api/v1/workspace/spend-requests/[id]", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it("returns 409 when the spend request was already decided", async () => {
		mocks.decideSpendRequest.mockResolvedValue({
			code: "conflict",
			message: "Spend request was already decided.",
			status: "error",
		});

		const response = await patchRequest();

		expect(response.status).toEqual(409);
		await expect(response.json()).resolves.toMatchObject({
			code: "workspace_spend_request_conflict",
			error: "Spend request was already decided.",
		});
	});

	it("returns updated spend request on success", async () => {
		mocks.decideSpendRequest.mockResolvedValue({
			request: { ...financialDatasetFixture.spendRequests[0], status: "approved" },
			status: "success",
		});

		const response = await patchRequest();

		expect(response.status).toEqual(200);
		expect(response.headers.get("Link")).toBeNull();
	});
});
