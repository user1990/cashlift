"use client";

import { type QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/ui/components/Button";
import { decideSpendRequest, type SpendRequestDecisionRequest } from "../api";
import type { SpendRequest } from "../types";
import { type ApprovalQueueRequest, ApprovalRequestList } from "./ApprovalRequestList";

type InteractiveApprovalQueueProps = {
	datasetQueryKey: QueryKey;
	requests: ApprovalQueueRequest[];
};

type ApprovalQueueDataset = {
	spendRequests: ApprovalQueueRequest[];
};

type ApprovalQueueMutationContext = {
	snapshots: [QueryKey, ApprovalQueueDataset | undefined][];
};

type SpendRequestStatusUpdate = Pick<SpendRequest, "id" | "status">;

export const InteractiveApprovalQueue = ({ datasetQueryKey, requests }: InteractiveApprovalQueueProps) => {
	const queryClient = useQueryClient();
	const decisionMutation = useMutation<SpendRequest, Error, SpendRequestDecisionRequest, ApprovalQueueMutationContext>({
		mutationKey: datasetQueryKey,
		mutationFn: decideSpendRequest,
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
	const pendingDecision = decisionMutation.variables;

	return (
		<ApprovalRequestList
			requests={requests}
			renderActions={({ id, vendor }) => (
				<div className="mt-3 flex flex-wrap gap-2">
					<Button
						aria-label={`Approve ${vendor}`}
						disabled={pendingDecision?.id === id}
						onPress={() => decisionMutation.mutate({ id, status: "approved" })}
						size="small"
						variant="success"
					>
						<Check aria-hidden className="size-4" />
						{pendingDecision?.id === id && pendingDecision.status === "approved" ? "Approving" : "Approve"}
					</Button>

					<Button
						aria-label={`Reject ${vendor}`}
						disabled={pendingDecision?.id === id}
						onPress={() => decisionMutation.mutate({ id, status: "rejected" })}
						size="small"
						variant="secondary"
					>
						<X aria-hidden className="size-4" />
						{pendingDecision?.id === id && pendingDecision.status === "rejected" ? "Rejecting" : "Reject"}
					</Button>
				</div>
			)}
		/>
	);
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
