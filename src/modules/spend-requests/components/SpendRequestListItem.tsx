import type { ReactNode } from "react";
import { formatCurrency } from "@/modules/money/format";
import type { MoneyCents } from "@/modules/money/types";

type SpendRequestListItemProps = {
	amountCents: MoneyCents;
	meta: ReactNode;
	reason: string;
	vendor: string;
	cashAfterApprovalCents?: MoneyCents;
};

export const SpendRequestListItem = ({
	amountCents,
	cashAfterApprovalCents,
	meta,
	reason,
	vendor,
}: SpendRequestListItemProps) => (
	<li className="rounded-lg border border-border bg-panel-muted p-3">
		<div className="flex items-start justify-between gap-3">
			<div>
				<p className="text-m+ text-panel-foreground">{vendor}</p>

				<p className="mt-1 text-s leading-5 text-muted-foreground">{meta}</p>
			</div>

			<span className="font-mono text-m+">{formatCurrency(amountCents)}</span>
		</div>

		<p className="mt-3 text-s leading-5 text-muted-foreground">{reason}</p>

		{cashAfterApprovalCents !== undefined && (
			<div className="mt-3 rounded-md bg-panel p-2 text-s text-muted-foreground">
				<span>Cash after approval: </span>

				<span className="font-mono text-s+ text-panel-foreground">{formatCurrency(cashAfterApprovalCents)}</span>
			</div>
		)}
	</li>
);
