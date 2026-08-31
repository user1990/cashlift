"use client";

import { Check, X } from "lucide-react";
import { Button } from "@/ui/components/actions/Button";
import { cn } from "@/ui/utils/cn";
import type { SpendRequestDecisionRequest } from "../api";

type ApprovalDecisionActionsProps = {
	disabled: boolean;
	id: string;
	onDecide: (decision: SpendRequestDecisionRequest) => void;
	vendor: string;
	className?: string;
	pendingDecision?: SpendRequestDecisionRequest;
	size?: "large" | "small";
};

export const ApprovalDecisionActions = ({
	className,
	disabled,
	id,
	onDecide,
	pendingDecision,
	size = "small",
	vendor,
}: ApprovalDecisionActionsProps) => (
	<div className={cn("flex flex-wrap gap-2", className)}>
		<Button
			aria-label={`Approve ${vendor}`}
			className={size === "large" ? "min-h-12 rounded-lg px-4" : undefined}
			disabled={disabled}
			onPress={() => onDecide({ id, status: "approved" })}
			size={size}
			variant="success"
		>
			<Check aria-hidden className="size-4" />
			{pendingDecision?.id === id && pendingDecision.status === "approved" ? "Approving" : "Approve"}
		</Button>

		<Button
			aria-label={`Reject ${vendor}`}
			className={size === "large" ? "min-h-12 rounded-lg px-4" : undefined}
			disabled={disabled}
			onPress={() => onDecide({ id, status: "rejected" })}
			size={size}
			variant="secondary"
		>
			<X aria-hidden className="size-4" />
			{pendingDecision?.id === id && pendingDecision.status === "rejected" ? "Rejecting" : "Reject"}
		</Button>
	</div>
);
