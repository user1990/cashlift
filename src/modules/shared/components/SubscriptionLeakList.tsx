import { percentage } from "@/modules/common/money/format";
import { AmountListItem } from "@/modules/shared/components/AmountListItem";

type SubscriptionLeakRow = {
	amountCents: number;
	id: string;
	status: string;
	usagePercent: number;
	vendor: string;
};

type SubscriptionLeakListProps = {
	className?: string;
	items: SubscriptionLeakRow[];
};

export const SubscriptionLeakList = ({ className, items }: SubscriptionLeakListProps) => (
	<ul className={className}>
		{items.map(({ amountCents, id, status, usagePercent, vendor }) => (
			<AmountListItem
				key={id}
				amountCents={amountCents}
				meta={`${status} · usage ${percentage(usagePercent)}`}
				title={vendor}
			/>
		))}
	</ul>
);
