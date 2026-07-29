import type { ReactNode } from "react";
import { AmountItem } from "@/modules/money/components/AmountItem";
import { formatCurrency } from "@/modules/money/format";
import type { MoneyCents } from "@/modules/money/types";

type RequestItemProps = {
	amountCents: MoneyCents;
	meta: ReactNode;
	reason: string;
	vendor: string;
	actions?: ReactNode;
	cashAfterApprovalCents?: MoneyCents;
};

export const RequestItem = ({
	actions,
	amountCents,
	cashAfterApprovalCents,
	meta,
	reason,
	vendor,
}: RequestItemProps) => (
	<AmountItem
		amountCents={amountCents}
		description={reason}
		footer={
			(cashAfterApprovalCents !== undefined || actions) && (
				<>
					{cashAfterApprovalCents !== undefined && (
						<div className="mt-3 rounded-md bg-panel p-2 text-muted-foreground text-s">
							<span>Cash after approval: </span>

							<span className="font-mono text-panel-foreground text-s+">{formatCurrency(cashAfterApprovalCents)}</span>
						</div>
					)}

					{actions}
				</>
			)
		}
		meta={meta}
		title={vendor}
	/>
);
