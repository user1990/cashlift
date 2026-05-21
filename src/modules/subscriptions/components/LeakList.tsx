import { AmountItem } from "@/modules/money/components/AmountItem";
import { percentage } from "@/modules/money/format";

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
				meta={`${status} · usage ${percentage(usagePercent)}`}
			/>
		))}
	</ul>
);
