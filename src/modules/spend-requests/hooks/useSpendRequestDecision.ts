"use client";

import { type QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { decideSpendRequest, type SpendRequestDecisionRequest } from "../api";
import type { SpendRequest } from "../types";

type ApprovalQueueDataset = {
	spendRequests: Array<Pick<SpendRequest, "id" | "status" | "vendor"> & Record<string, unknown>>;
};

type ApprovalQueueMutationContext = {
	snapshots: [QueryKey, ApprovalQueueDataset | undefined][];
};

type SpendRequestStatusUpdate = Pick<SpendRequest, "id" | "status">;

export const useSpendRequestDecision = (datasetQueryKey: QueryKey) => {
	const queryClient = useQueryClient();
	const decisionMutation = useMutation<SpendRequest, Error, SpendRequestDecisionRequest, ApprovalQueueMutationContext>({
		mutationFn: decideSpendRequest,
		mutationKey: datasetQueryKey,
		onError: (error, decision, context) => {
			context?.snapshots.forEach(([queryKey, snapshot]) => {
				queryClient.setQueryData<ApprovalQueueDataset | undefined>(queryKey, (dataset) =>
					rollbackDatasetSpendRequest(dataset, snapshot, decision.id),
				);
			});
			toast.error("Spend update failed", { description: error.message });
		},
		onMutate: async (decision) => {
			await queryClient.cancelQueries({ queryKey: datasetQueryKey });
			const snapshots = queryClient.getQueriesData<ApprovalQueueDataset>({ queryKey: datasetQueryKey });

			queryClient.setQueriesData<ApprovalQueueDataset>({ queryKey: datasetQueryKey }, (dataset) =>
				dataset ? updateDatasetSpendRequest(dataset, decision) : dataset,
			);

			return { snapshots };
		},
		onSuccess: (request) => {
			queryClient.setQueriesData<ApprovalQueueDataset>({ queryKey: datasetQueryKey }, (dataset) =>
				dataset ? updateDatasetSpendRequest(dataset, request) : dataset,
			);
			toast.success(request.status === "approved" ? "Spend approved" : "Spend rejected", {
				description: request.vendor,
			});
		},
	});

	return {
		decide: decisionMutation.mutate,
		pending: decisionMutation.isPending,
		pendingDecision: decisionMutation.variables,
	};
};

function updateDatasetSpendRequest(
	dataset: ApprovalQueueDataset,
	decision: SpendRequestStatusUpdate,
): ApprovalQueueDataset {
	return {
		...dataset,
		spendRequests: dataset.spendRequests.map((request) =>
			request.id === decision.id ? { ...request, status: decision.status } : request,
		),
	};
}

function rollbackDatasetSpendRequest(
	dataset: ApprovalQueueDataset | undefined,
	snapshot: ApprovalQueueDataset | undefined,
	requestId: SpendRequest["id"],
): ApprovalQueueDataset | undefined {
	if (!dataset || !snapshot) {
		return snapshot;
	}

	const previousRequest = snapshot.spendRequests.find((request) => request.id === requestId);

	if (!previousRequest) {
		return dataset;
	}

	return {
		...dataset,
		spendRequests: dataset.spendRequests.map((request) =>
			request.id === requestId ? { ...request, status: previousRequest.status } : request,
		),
	};
}
