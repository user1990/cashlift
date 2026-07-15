"use client";

import type { QueryKey } from "@tanstack/react-query";
import { type ApprovalQueueRequest, ApprovalRequestList } from "./ApprovalRequestList";
import { InteractiveApprovalQueue } from "./InteractiveApprovalQueue";

type ApprovalQueueProps = {
	datasetQueryKey: QueryKey;
	requests: ApprovalQueueRequest[];
	readOnly?: boolean;
};

export const ApprovalQueue = ({ datasetQueryKey, readOnly = false, requests }: ApprovalQueueProps) =>
	readOnly ? (
		<ApprovalRequestList requests={requests} />
	) : (
		<InteractiveApprovalQueue datasetQueryKey={datasetQueryKey} requests={requests} />
	);
