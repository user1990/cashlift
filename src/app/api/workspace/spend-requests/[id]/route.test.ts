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
		new Request("https://example.com/api/workspace/spend-requests/request-brandforge", {
			body: JSON.stringify(body),
			method: "PATCH",
		}),
		{ params: Promise.resolve({ id: "request-brandforge" }) },
	);
};

describe("PATCH /api/workspace/spend-requests/[id]", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it("returns updated spend request on success", async () => {
		mocks.decideSpendRequest.mockResolvedValue({
			request: { ...financialDatasetFixture.spendRequests[0], status: "approved" },
			status: "success",
		});

		const response = await patchRequest();

		expect(response.status).toEqual(200);
		expect(response.headers.get("Cache-Control")).toEqual("no-store");
		expect(mocks.decideSpendRequest).toHaveBeenCalledWith({ id: "request-brandforge", status: "approved" });
		await expect(response.json()).resolves.toMatchObject({ id: "request-brandforge", status: "approved" });
	});

	it.each([
		[400, { code: "invalid" as const, message: "Spend request decision is invalid.", status: "error" as const }],
		[401, { code: "unauthenticated" as const, message: "Sign in to update spend requests.", status: "error" as const }],
		[
			403,
			{
				code: "forbidden" as const,
				message: "Only finance leads and managers can decide spend requests.",
				status: "error" as const,
			},
		],
		[404, { code: "not_found" as const, message: "Spend request was not found.", status: "error" as const }],
		[
			500,
			{
				code: "unavailable" as const,
				message: "Unable to update spend request.",
				requestId: "event-id",
				status: "error" as const,
			},
		],
	])("returns %s when decision fails", async (status, result) => {
		mocks.decideSpendRequest.mockResolvedValue(result);

		const response = await patchRequest();

		expect(response.status).toEqual(status);
		expect(response.headers.get("Cache-Control")).toEqual("no-store");
		const body = await response.json();
		expect(body.error).toBe(result.message);

		if ("requestId" in result) {
			expect(body.requestId).toBe(result.requestId);
		}
	});
});
