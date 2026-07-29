import { AmountItem } from "@/modules/money/components/AmountItem";
import { getPercentage } from "@/modules/money/format";
import { Badge } from "@/ui/components/data/Badge";
import type { Subscription } from "../types";
import { isVendorLeak } from "../utils";

type LeakListProps = {
	items: Subscription[];
	className?: string;
};

export const LeakList = ({ items, className }: LeakListProps) => {
	const leaks = items.filter(isVendorLeak);

	return (
		<ul className={className}>
			{!leaks.length && <li>No vendor leaks need action.</li>}

			{leaks.map(({ amountCents, id, status, usagePercent, vendor }) => (
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
};
