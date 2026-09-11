import { HttpResponse, type HttpResponseResolver, http } from "msw";
import type { SpendRequestDecisionStatus } from "./api";
import type { SpendRequest } from "./types";

type SpendRequestDecisionParams = {
	id: string;
};

type SpendRequestDecisionBody = {
	status: SpendRequestDecisionStatus;
};

type SpendRequestDecisionResponse = Record<string, unknown>;

type SpendRequestDecisionResolver = HttpResponseResolver<
	SpendRequestDecisionParams,
	SpendRequestDecisionBody,
	SpendRequestDecisionResponse
>;

export const BRAND_FORGE_SPEND_REQUEST_FIXTURE: SpendRequest = {
	amountCents: 680_000,
	category: "software",
	id: "request-brandforge",
	neededByDate: "2026-05-09",
	reason: "Annual creative suite for retained client work",
	requestedDate: "2026-05-07",
	requester: "Leo",
	status: "pending",
	team: "Creative",
	vendor: "BrandForge",
};

const defaultSpendRequestDecisionResolver: SpendRequestDecisionResolver = async ({ params, request }) => {
	const { status } = await request.json();

	return HttpResponse.json({
		...BRAND_FORGE_SPEND_REQUEST_FIXTURE,
		id: params.id,
		status,
	});
};

export const createDecideSpendRequestHandler = (
	resolve: SpendRequestDecisionResolver = defaultSpendRequestDecisionResolver,
) =>
	http.patch<SpendRequestDecisionParams, SpendRequestDecisionBody, SpendRequestDecisionResponse>(
		"/api/v1/workspace/spend-requests/:id",
		resolve,
	);

export const DEFAULT_SPEND_REQUEST_API_HANDLERS = [createDecideSpendRequestHandler()];
