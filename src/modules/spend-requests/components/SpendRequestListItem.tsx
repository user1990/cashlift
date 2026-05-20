import type { ReactNode } from "react";
import { AmountListItem } from "@/modules/money/components/AmountListItem";
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
	<AmountListItem
		amountCents={amountCents}
		description={reason}
		footer={
			cashAfterApprovalCents !== undefined && (
				<div className="mt-3 rounded-md bg-panel p-2 text-s text-muted-foreground">
					<span>Cash after approval: </span>

					<span className="font-mono text-s+ text-panel-foreground">{formatCurrency(cashAfterApprovalCents)}</span>
				</div>
			)
		}
		meta={meta}
		title={vendor}
	/>
);
