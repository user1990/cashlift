import { CalendarClock } from "lucide-react";
import { formatCurrency } from "@/modules/common/money/format";
import { Panel, PanelHeader } from "@/modules/ui/components/Panel";
import type { UpcomingBill } from "../types";

type BillsPanelProps = {
	upcomingBills: UpcomingBill[];
	unusedSubscriptionSavings: number;
};

export const BillsPanel = ({
	upcomingBills,
	unusedSubscriptionSavings,
}: BillsPanelProps) => (
	<Panel>
		<PanelHeader
			action={
				<span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
					{formatCurrency(unusedSubscriptionSavings)} leak
				</span>
			}
			eyebrow="Bills + subscriptions"
			title="Upcoming obligations"
		/>

		<div className="divide-y divide-[#E8E8EC]">
			{upcomingBills.map((item) => (
				<div
					className="flex items-center justify-between gap-4 py-3"
					key={item.id}
				>
					<div className="flex items-center gap-3">
						<span className="rounded-md bg-[#F7F7F8] p-2 text-[#6B6B6B]">
							<CalendarClock aria-hidden className="size-4" />
						</span>

						<div>
							<p className="text-sm font-medium text-[#0A0A0A]">{item.label}</p>

							<p className="text-xs text-[#6B6B6B]">
								Due in {item.daysUntilDue} day
								{item.daysUntilDue === 1 ? "" : "s"}
							</p>
						</div>
					</div>

					<span className="font-mono text-sm font-semibold">
						{formatCurrency(item.amountCents)}
					</span>
				</div>
			))}
		</div>
	</Panel>
);
