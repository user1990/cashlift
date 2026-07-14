import { HttpResponse, type HttpResponseResolver, http } from "msw";
import type { SpendRequestDecisionStatus } from "./api";
import type { SpendRequest } from "./types";

type SpendRequestDecisionParams = {
	id: string;
};

type SpendRequestDecisionBody = {
	status: SpendRequestDecisionStatus;
};

type SpendRequestDecisionResponse = SpendRequest | { error: string };

type SpendRequestDecisionResolver = HttpResponseResolver<
	SpendRequestDecisionParams,
	SpendRequestDecisionBody,
	SpendRequestDecisionResponse
>;

const defaultSpendRequestDecisionResolver: SpendRequestDecisionResolver = async ({ params, request }) => {
	const { status } = await request.json();

	return HttpResponse.json({
		amountCents: 680_000,
		category: "software",
		id: params.id,
		neededByDate: "2026-05-09",
		reason: "Annual creative suite for retained client work",
		requestedDate: "2026-05-07",
		requester: "Leo",
		status,
		team: "Creative",
		vendor: "BrandForge",
	});
};

export const createDecideSpendRequestHandler = (
	resolve: SpendRequestDecisionResolver = defaultSpendRequestDecisionResolver,
) =>
	http.patch<SpendRequestDecisionParams, SpendRequestDecisionBody, SpendRequestDecisionResponse>(
		"/api/workspace/spend-requests/:id",
		resolve,
	);

export const DEFAULT_SPEND_REQUEST_API_HANDLERS = [createDecideSpendRequestHandler()];
