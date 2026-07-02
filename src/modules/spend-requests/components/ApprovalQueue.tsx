"use client";

import { type QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { useState } from "react";
import type { MoneyCents } from "@/modules/money/types";
import { Badge } from "@/ui/components/Badge";
import { Button } from "@/ui/components/Button";
import { decideSpendRequest, type SpendRequestDecisionRequest } from "../api";
import type { SpendRequest } from "../types";
import { RequestItem } from "./RequestItem";

type ApprovalQueueProps = {
	datasetQueryKey: QueryKey;
	requests: ApprovalQueueRequest[];
};

type ApprovalQueueRequest = SpendRequest & {
	cashAfterApprovalCents?: MoneyCents;
};

type ApprovalQueueDataset = {
	spendRequests: ApprovalQueueRequest[];
};

type ApprovalQueueMutationContext = {
	snapshots: [QueryKey, ApprovalQueueDataset | undefined][];
};

export const ApprovalQueue = ({ datasetQueryKey, requests }: ApprovalQueueProps) => {
	const queryClient = useQueryClient();
	const [message, setMessage] = useState<string | null>(null);
	const pendingRequests = requests.filter((request) => request.status === "pending");

	const decisionMutation = useMutation<SpendRequest, Error, SpendRequestDecisionRequest, ApprovalQueueMutationContext>({
		mutationKey: datasetQueryKey,
		mutationFn: decideSpendRequest,
		onError: (error, _decision, context) => {
			context?.snapshots.forEach(([queryKey, data]) => {
				queryClient.setQueryData(queryKey, data);
			});
			setMessage(error.message);
		},
		onMutate: async (decision) => {
			setMessage(null);
			await queryClient.cancelQueries({ queryKey: datasetQueryKey });
			const snapshots = queryClient.getQueriesData<ApprovalQueueDataset>({ queryKey: datasetQueryKey });

			queryClient.setQueriesData<ApprovalQueueDataset>({ queryKey: datasetQueryKey }, (dataset) =>
				dataset ? updateDatasetSpendRequest(dataset, decision) : dataset,
			);

			return { snapshots };
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: datasetQueryKey }),
	});
	const pendingDecision = decisionMutation.variables;

	return (
		<>
			{message && (
				<p
					aria-live="polite"
					className="mb-3 rounded-md border border-warning/30 bg-warning/10 px-3 py-2 text-s text-warning"
				>
					{message}
				</p>
			)}

			{!!pendingRequests.length ? (
				<ul className="space-y-3">
					{pendingRequests.map(
						({ amountCents, cashAfterApprovalCents, id, reason, requester, status, team, vendor }) => (
							<RequestItem
								key={id}
								actions={
									<div className="mt-3 flex flex-wrap gap-2">
										<Button
											aria-label={`Approve ${vendor}`}
											className="h-8 px-2.5 text-s"
											disabled={pendingDecision?.id === id}
											onClick={() => decisionMutation.mutate({ id, status: "approved" })}
											variant="primary"
										>
											<Check aria-hidden className="size-4" />
											{pendingDecision?.id === id && pendingDecision.status === "approved" ? "Approving" : "Approve"}
										</Button>

										<Button
											aria-label={`Reject ${vendor}`}
											className="h-8 px-2.5 text-s"
											disabled={pendingDecision?.id === id}
											onClick={() => decisionMutation.mutate({ id, status: "rejected" })}
											variant="secondary"
										>
											<X aria-hidden className="size-4" />
											{pendingDecision?.id === id && pendingDecision.status === "rejected" ? "Rejecting" : "Reject"}
										</Button>
									</div>
								}
								amountCents={amountCents}
								cashAfterApprovalCents={cashAfterApprovalCents}
								meta={
									<span className="flex flex-wrap items-center gap-1.5">
										<Badge variant={status === "approved" ? "success" : status === "rejected" ? "danger" : "warning"}>
											{status}
										</Badge>

										<span>{requester}</span>

										<span>{team}</span>
									</span>
								}
								reason={reason}
								vendor={vendor}
							/>
						),
					)}
				</ul>
			) : (
				<p className="rounded-lg border border-border bg-panel-muted p-3 text-m text-muted-foreground">
					No pending spend requests.
				</p>
			)}
		</>
	);
};

function updateDatasetSpendRequest(
	dataset: ApprovalQueueDataset,
	decision: SpendRequestDecisionRequest,
): ApprovalQueueDataset {
	return {
		...dataset,
		spendRequests: dataset.spendRequests.map((request) =>
			request.id === decision.id ? { ...request, status: decision.status } : request,
		),
	};
}
