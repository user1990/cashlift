"use client";

import type { QueryKey } from "@tanstack/react-query";
import { useSpendRequestDecision } from "../hooks/useSpendRequestDecision";
import { ApprovalDecisionActions } from "./ApprovalDecisionActions";
import { type ApprovalQueueRequest, ApprovalRequestList } from "./ApprovalRequestList";

type InteractiveApprovalQueueProps = {
	datasetQueryKey: QueryKey;
	requests: ApprovalQueueRequest[];
};

export const InteractiveApprovalQueue = ({ datasetQueryKey, requests }: InteractiveApprovalQueueProps) => {
	const { decide, pending, pendingDecision } = useSpendRequestDecision(datasetQueryKey);

	return (
		<ApprovalRequestList
			requests={requests}
			renderActions={({ id, vendor }) => (
				<ApprovalDecisionActions
					className="mt-3"
					disabled={pending}
					id={id}
					onDecide={decide}
					pendingDecision={pendingDecision}
					vendor={vendor}
				/>
			)}
		/>
	);
};
