"use client";

import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useOptimistic, useState } from "react";
import { Button } from "@/ui/components/Button";
import { decideSpendRequestAction } from "../actions";
import type { SpendRequest, SpendRequestStatus } from "../types";
import { RequestItem } from "./RequestItem";

type ApprovalQueueProps = {
	requests: SpendRequest[];
};

type OptimisticDecision = {
	id: string;
	status: Exclude<SpendRequestStatus, "pending">;
};

export const ApprovalQueue = ({ requests }: ApprovalQueueProps) => {
	const { refresh } = useRouter();
	const [message, setMessage] = useState<string | null>(null);
	const [optimisticRequests, addOptimisticDecision] = useOptimistic(
		requests,
		(currentRequests, decision: OptimisticDecision) =>
			currentRequests.map((request) =>
				request.id === decision.id ? { ...request, status: decision.status } : request,
			),
	);
	const pendingRequests = optimisticRequests.filter((request) => request.status === "pending");

	const decideRequest = (decision: OptimisticDecision) => {
		setMessage(null);

		startTransition(async () => {
			addOptimisticDecision(decision);

			const result = await decideSpendRequestAction(decision);

			if (result.status === "error") {
				setMessage(result.message);
				return;
			}

			if (result.refresh) {
				refresh();
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

			{pendingRequests.length > 0 ? (
				<ul className="space-y-3">
					{pendingRequests.map(({ amountCents, id, reason, requester, status, team, vendor }) => (
						<RequestItem
							key={id}
							actions={
								<div className="mt-3 flex flex-wrap gap-2">
									<Button
										aria-label={`Approve ${vendor}`}
										className="h-8 px-2.5 text-s"
										onClick={() => decideRequest({ id, status: "approved" })}
										variant="primary"
									>
										<Check aria-hidden className="size-4" />
										Approve
									</Button>

									<Button
										aria-label={`Reject ${vendor}`}
										className="h-8 px-2.5 text-s"
										onClick={() => decideRequest({ id, status: "rejected" })}
										variant="secondary"
									>
										<X aria-hidden className="size-4" />
										Reject
									</Button>
								</div>
							}
							amountCents={amountCents}
							meta={`${requester} · ${team} · ${status}`}
							reason={reason}
							vendor={vendor}
						/>
					))}
				</ul>
			) : (
				<p className="rounded-lg border border-border bg-panel-muted p-3 text-m text-muted-foreground">
					No pending spend requests.
				</p>
			)}
		</>
	);
};
