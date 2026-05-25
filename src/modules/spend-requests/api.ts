import type { SpendRequest, SpendRequestStatus } from "./types";

export type SpendRequestDecisionStatus = Exclude<SpendRequestStatus, "pending">;

export type SpendRequestDecisionRequest = {
	id: string;
	status: SpendRequestDecisionStatus;
};

export const decideSpendRequest = async ({ id, status }: SpendRequestDecisionRequest) => {
	const response = await fetch(`/api/workspace/spend-requests/${id}`, {
		body: JSON.stringify({ status }),
		headers: {
			"Content-Type": "application/json",
		},
		method: "PATCH",
	});

	if (!response.ok) {
		const body = (await response.json().catch(() => null)) as { error?: string } | null;

		throw new Error(body?.error ?? "Unable to update spend request.");
	}

	return response.json() as Promise<SpendRequest>;
};
