import { AmountItem } from "@/modules/money/components/AmountItem";
import { getPercentage } from "@/modules/money/format";
import { Badge } from "@/ui/components/Badge";

type SubscriptionLeakRow = {
	amountCents: number;
	id: string;
	status: string;
	usagePercent: number;
	vendor: string;
};

type LeakListProps = {
	items: SubscriptionLeakRow[];
	className?: string;
};

export const LeakList = ({ items, className }: LeakListProps) => (
	<ul className={className}>
		{items.map(({ amountCents, id, status, usagePercent, vendor }) => (
			<AmountItem
				key={id}
				title={vendor}
				amountCents={amountCents}
				meta={
					<span className="flex flex-wrap items-center gap-1.5">
						<Badge variant={status === "trial" ? "warning" : "danger"}>{status}</Badge>

						<span>Usage {getPercentage(usagePercent)}</span>
					</span>
				}
			/>
		))}
	</ul>
);
