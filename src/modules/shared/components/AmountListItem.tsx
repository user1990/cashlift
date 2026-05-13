import type { ReactNode } from "react";
import { formatCurrency } from "@/modules/common/money/format";
import type { MoneyCents } from "@/modules/common/money/types";

type AmountListItemProps = {
	amountCents: MoneyCents;
	meta: ReactNode;
	title: string;
};

export const AmountListItem = ({ amountCents, meta, title }: AmountListItemProps) => (
	<li className="rounded-lg border border-border bg-panel-muted p-3">
		<div className="flex items-start justify-between gap-3">
			<p className="text-m+ text-panel-foreground">{title}</p>

			<span className="font-mono text-m+">{formatCurrency(amountCents)}</span>
		</div>

		<p className="mt-2 text-s leading-5 text-muted-foreground">{meta}</p>
	</li>
);
