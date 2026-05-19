import { AmountListItem } from "@/modules/money/components/AmountListItem";
import { percentage } from "@/modules/money/format";

type SubscriptionLeakRow = {
	amountCents: number;
	id: string;
	status: string;
	usagePercent: number;
	vendor: string;
};

type SubscriptionLeakListProps = {
	items: SubscriptionLeakRow[];
	className?: string;
};

export const SubscriptionLeakList = ({ items, className }: SubscriptionLeakListProps) => (
	<ul className={className}>
		{items.map(({ amountCents, id, status, usagePercent, vendor }) => (
			<AmountListItem
				key={id}
				title={vendor}
				amountCents={amountCents}
				meta={`${status} · usage ${percentage(usagePercent)}`}
			/>
		))}
	</ul>
);
