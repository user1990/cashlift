import { z } from "zod";
import { spendRequestSchema } from "./schemas";
import type { SpendRequestStatus } from "./types";

export type SpendRequestDecisionStatus = Exclude<SpendRequestStatus, "pending">;

export type SpendRequestDecisionRequest = {
	id: string;
	status: SpendRequestDecisionStatus;
};

const apiErrorSchema = z.object({
	error: z.string().optional(),
});

export const decideSpendRequest = async ({ id, status }: SpendRequestDecisionRequest) => {
	const response = await fetch(`/api/workspace/spend-requests/${id}`, {
		body: JSON.stringify({ status }),
		headers: {
			"Content-Type": "application/json",
		},
		method: "PATCH",
	});

	if (!response.ok) {
		const body = apiErrorSchema.safeParse(await response.json().catch(() => null));

		throw new Error(
			body.success ? (body.data.error ?? "Unable to update spend request.") : "Unable to update spend request.",
		);
	}

	return spendRequestSchema.parse(await response.json());
};
