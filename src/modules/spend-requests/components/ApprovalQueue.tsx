"use client";

import { Check, X } from "lucide-react";
import { useOptimistic, useState, useTransition } from "react";
import type { MoneyCents } from "@/modules/money/types";
import { Button } from "@/ui/components/Button";
import { decideSpendRequest, type SpendRequestDecisionRequest } from "../api";
import type { SpendRequest, SpendRequestStatus } from "../types";
import { RequestItem } from "./RequestItem";

type ApprovalQueueProps = {
	requests: ApprovalQueueRequest[];
};

type ApprovalQueueRequest = SpendRequest & {
	cashAfterApprovalCents?: MoneyCents;
};

type ConfirmedDecisions = Record<string, SpendRequestStatus>;

export const ApprovalQueue = ({ requests }: ApprovalQueueProps) => {
	const [confirmedDecisions, setConfirmedDecisions] = useState<ConfirmedDecisions>({});
	const [message, setMessage] = useState<string | null>(null);
	const [pendingDecision, setPendingDecision] = useState<SpendRequestDecisionRequest | null>(null);
	const [, startTransition] = useTransition();
	const confirmedRequests = updateSpendRequests(requests, confirmedDecisions);
	const [optimisticRequests, addOptimisticDecision] = useOptimistic(
		confirmedRequests,
		(currentRequests, decision: SpendRequestDecisionRequest) => updateSpendRequests(currentRequests, decision),
	);
	const pendingRequests = optimisticRequests.filter((request) => request.status === "pending");

	const decideRequest = (decision: SpendRequestDecisionRequest) => {
		setMessage(null);
		setPendingDecision(decision);

		startTransition(async () => {
			addOptimisticDecision(decision);

			try {
				const result = await decideSpendRequest(decision);
				setConfirmedDecisions((currentDecisions) => ({
					...currentDecisions,
					[result.id]: result.status,
				}));
				setPendingDecision(null);
			} catch (error) {
				setMessage(error instanceof Error ? error.message : "Unable to update spend request.");
				setPendingDecision(null);
			}
		});
	};

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
											onClick={() => decideRequest({ id, status: "approved" })}
											variant="primary"
										>
											<Check aria-hidden className="size-4" />
											{pendingDecision?.id === id && pendingDecision.status === "approved" ? "Approving" : "Approve"}
										</Button>

										<Button
											aria-label={`Reject ${vendor}`}
											className="h-8 px-2.5 text-s"
											disabled={pendingDecision?.id === id}
											onClick={() => decideRequest({ id, status: "rejected" })}
											variant="secondary"
										>
											<X aria-hidden className="size-4" />
											{pendingDecision?.id === id && pendingDecision.status === "rejected" ? "Rejecting" : "Reject"}
										</Button>
									</div>
								}
								amountCents={amountCents}
								cashAfterApprovalCents={cashAfterApprovalCents}
								meta={`${requester} · ${team} · ${status}`}
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

function updateSpendRequests(
	requests: ApprovalQueueRequest[],
	decisions: ConfirmedDecisions | SpendRequestDecisionRequest,
): ApprovalQueueRequest[] {
	return requests.map((request) => {
		const status = "id" in decisions ? decisions.id === request.id && decisions.status : decisions[request.id];

		return status ? { ...request, status } : request;
	});
}
