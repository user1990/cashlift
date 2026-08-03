// @vitest-environment jsdom

import { HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { server } from "@/test/server";
import { decideSpendRequest } from "./api";
import { createDecideSpendRequestHandler } from "./fixtures";

describe("decideSpendRequest", () => {
	it("encodes the request ID and returns a validated spend request", async () => {
		const responseBody = { ...financialDatasetFixture.spendRequests[0], status: "approved" as const };
		const { getReceivedId } = mockSpendRequestDecisionSuccess(responseBody);

		const request = await decideSpendRequest({ id: "request/brand forge", status: "approved" });

		expect(request).toEqual(responseBody);
		expect(getReceivedId()).toBe("request/brand forge");
	});

	it("rejects an invalid success response with a stable client error", async () => {
		mockSpendRequestDecisionInvalidResponse();

		await expect(decideSpendRequest({ id: "request-brandforge", status: "approved" })).rejects.toThrow(
			"Unable to update spend request.",
		);
	});
});

function mockSpendRequestDecisionSuccess(responseBody: (typeof financialDatasetFixture.spendRequests)[number]) {
	let receivedId = "";

	server.use(
		createDecideSpendRequestHandler(({ params }) => {
			receivedId = params.id;

			return HttpResponse.json(responseBody);
		}),
	);

	return { getReceivedId: () => receivedId };
}

function mockSpendRequestDecisionInvalidResponse() {
	server.use(createDecideSpendRequestHandler(() => HttpResponse.json({ id: "request-brandforge" })));
}
