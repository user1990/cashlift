import { AmountItem } from "@/modules/money/components/AmountItem";
import { percentage } from "@/modules/money/format";
import { Badge } from "@/ui/components/Badge";
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
			{leaks.length === 0 ? <li>No vendor leaks need action.</li> : null}

			{leaks.map(({ amountCents, id, status, usagePercent, vendor }) => (
				<AmountItem
					key={id}
					title={vendor}
					amountCents={amountCents}
					meta={
						<span className="flex flex-wrap items-center gap-1.5">
							<Badge variant={status === "trial" ? "warning" : "danger"}>{status}</Badge>

							<span>Usage {percentage(usagePercent)}</span>
						</span>
					}
				/>
			))}
		</ul>
	);
};
