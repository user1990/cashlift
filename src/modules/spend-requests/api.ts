import { z } from "zod";
import { SPEND_REQUEST_SCHEMA } from "./schemas";
import type { SpendRequestStatus } from "./types";

export type SpendRequestDecisionStatus = Exclude<SpendRequestStatus, "pending">;

export type SpendRequestDecisionRequest = {
	id: string;
	status: SpendRequestDecisionStatus;
};

const API_ERROR_SCHEMA = z.object({
	error: z.string().optional(),
});

export const decideSpendRequest = async ({ id, status }: SpendRequestDecisionRequest) => {
	const response = await fetch(`/api/workspace/spend-requests/${encodeURIComponent(id)}`, {
		body: JSON.stringify({ status }),
		headers: {
			"Content-Type": "application/json",
		},
		method: "PATCH",
	});

	if (!response.ok) {
		const body = API_ERROR_SCHEMA.safeParse(await response.json().catch(() => null));

		throw new Error(
			body.success ? (body.data.error ?? "Unable to update spend request.") : "Unable to update spend request.",
		);
	}

	const request = SPEND_REQUEST_SCHEMA.safeParse(await response.json().catch(() => null));

	if (!request.success) {
		throw new Error("Unable to update spend request.");
	}

	return request.data;
};
