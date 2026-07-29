import type { ReactNode } from "react";
import type { MoneyCents } from "@/modules/money/types";
import { Badge } from "@/ui/components/data/Badge";
import type { SpendRequest } from "../types";
import { RequestItem } from "./RequestItem";

export type ApprovalQueueRequest = SpendRequest & {
	cashAfterApprovalCents?: MoneyCents;
};

type ApprovalRequestListProps = {
	requests: ApprovalQueueRequest[];
	renderActions?: (request: ApprovalQueueRequest) => ReactNode;
};

export const ApprovalRequestList = ({ renderActions, requests }: ApprovalRequestListProps) => {
	const pendingRequests = requests.filter((request) => request.status === "pending");

	return pendingRequests.length ? (
		<ul className="space-y-3">
			{pendingRequests.map((request) => {
				const { amountCents, cashAfterApprovalCents, id, reason, requester, status, team, vendor } = request;

				return (
					<RequestItem
						key={id}
						actions={renderActions?.(request)}
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
				);
			})}
		</ul>
	) : (
		<p className="rounded-lg border border-border bg-panel-muted p-3 text-m text-muted-foreground">
			No pending spend requests.
		</p>
	);
};
