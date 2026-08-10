import type { ReactNode } from "react";
import { formatCurrency } from "@/modules/money/format";
import type { MoneyCents } from "@/modules/money/types";

type AmountItemProps = {
	amountCents: MoneyCents;
	title: string;
	description?: ReactNode;
	footer?: ReactNode;
	meta?: ReactNode;
};

export const AmountItem = ({ amountCents, description, footer, meta, title }: AmountItemProps) => (
	<li className="rounded-lg border border-border bg-panel-muted p-3">
		<div className="flex items-start justify-between gap-3">
			<div className="min-w-0">
				<p className="text-m+ text-panel-foreground">{title}</p>

				{meta && <p className="mt-1 text-muted-foreground text-s leading-5">{meta}</p>}
			</div>

			<span className="shrink-0 font-mono text-m+">{formatCurrency(amountCents)}</span>
		</div>

		{description && <p className="mt-3 text-muted-foreground text-s leading-5">{description}</p>}

		{footer}
	</li>
);
