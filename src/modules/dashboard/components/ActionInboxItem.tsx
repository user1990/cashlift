import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/modules/money/format";
import { Badge } from "@/ui/components/data/Badge";
import { getCashActionDestination } from "../cashActionDestination";
import { formatDashboardDate } from "../overviewDateRangeLabel";
import type { DashboardViewModel } from "../types";

type CashAction = DashboardViewModel["actionInbox"][number];
type CashActionType = CashAction["type"];

type ActionInboxItemProps = Pick<
	CashAction,
	"description" | "dueDate" | "impactCents" | "owner" | "priority" | "title" | "type"
> & {
	basePath: string;
};

const ACTION_LABELS = {
	approval: "Approve spend",
	"cash-buffer": "Protect buffer",
	collection: "Recover cash",
	forecast: "Review forecast",
	"vendor-leak": "Cut waste",
} as const satisfies Record<CashActionType, string>;

export const ActionInboxItem = ({
	basePath,
	description,
	dueDate,
	impactCents,
	owner,
	priority,
	title,
	type,
}: ActionInboxItemProps) => (
	<li className="py-4 first:pt-0 last:pb-0">
		<Link
			className="group grid gap-4 outline-none transition-colors hover:text-primary focus-visible:ring-[3px] focus-visible:ring-primary/20 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start"
			href={getCashActionDestination(type, basePath)}
		>
			<span className="min-w-0">
				<span className="mb-1.5 flex flex-wrap items-center gap-2">
					<Badge variant={getPriorityBadgeVariant(priority)}>{priority}</Badge>

					<span className="text-muted-foreground text-s">{ACTION_LABELS[type]}</span>

					<span className="text-muted-foreground text-s">Due {formatDashboardDate(dueDate)}</span>
				</span>

				<span className="block font-semibold text-m+ text-panel-foreground group-hover:text-primary">{title}</span>

				<span className="mt-1 block text-m text-muted-foreground leading-6">{description}</span>
			</span>

			<span className="flex min-w-0 items-center justify-between gap-3 sm:block sm:pt-0.5 sm:text-right">
				<span className="block shrink-0 font-mono font-semibold text-l+ text-panel-foreground">
					{formatCurrency(impactCents)}
				</span>

				<span className="mt-1 flex min-w-0 items-center justify-end gap-2 text-muted-foreground text-s">
					{owner}
					<ArrowRight
						aria-hidden
						className="size-4 shrink-0 transition-transform duration-[var(--motion-duration-micro)] ease-in-out group-hover:translate-x-0.5 motion-reduce:transition-none"
					/>
				</span>
			</span>
		</Link>
	</li>
);

function getPriorityBadgeVariant(priority: CashAction["priority"]) {
	if (priority === "critical") {
		return "danger";
	}

	if (priority === "high") {
		return "warning";
	}

	return "neutral";
}
