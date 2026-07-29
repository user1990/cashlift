import { ArrowRight, CircleDollarSign, type LucideIcon, ReceiptText, ShieldCheck, TrendingUp } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/modules/money/format";
import { Badge } from "@/ui/components/data/Badge";
import { getCashActionDestination } from "../cashActionDestination";
import type { DashboardViewModel } from "../types";

type CashAction = DashboardViewModel["actionInbox"][number];
type CashActionType = CashAction["type"];

type ActionInboxItemProps = Pick<
	CashAction,
	"description" | "impactCents" | "owner" | "priority" | "title" | "type"
> & {
	basePath: string;
	index: number;
};

const ACTION_LABELS = {
	approval: "Approve spend",
	"cash-buffer": "Protect buffer",
	collection: "Recover cash",
	forecast: "Review forecast",
	"vendor-leak": "Cut waste",
} as const satisfies Record<CashActionType, string>;

const ACTION_ICONS = {
	approval: ShieldCheck,
	"cash-buffer": TrendingUp,
	collection: CircleDollarSign,
	forecast: TrendingUp,
	"vendor-leak": ReceiptText,
} as const satisfies Record<CashActionType, LucideIcon>;

export const ActionInboxItem = ({
	basePath,
	description,
	impactCents,
	index,
	owner,
	priority,
	title,
	type,
}: ActionInboxItemProps) => (
	<li className="py-4 first:pt-0 last:pb-0">
		<Link
			className="group grid gap-4 transition-colors hover:text-primary sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center"
			href={getCashActionDestination(type, basePath)}
		>
			<span className="grid size-10 place-items-center rounded-full bg-primary-muted font-mono text-s font-semibold text-primary">
				{index + 1}
			</span>

			<span className="min-w-0">
				<span className="mb-1.5 flex flex-wrap items-center gap-2">
					<ActionIcon type={type} />

					<Badge variant={priority === "critical" ? "danger" : "warning"}>{priority}</Badge>

					<span className="text-s font-semibold text-muted-foreground">{ACTION_LABELS[type]}</span>
				</span>

				<span className="block text-m+ font-semibold text-panel-foreground group-hover:text-primary">{title}</span>

				<span className="mt-1 block text-m leading-6 text-muted-foreground">{description}</span>
			</span>

			<span className="flex items-center justify-between gap-3 sm:block sm:text-right">
				<span className="block font-mono text-m+ font-semibold text-panel-foreground">
					{formatCurrency(impactCents)}
				</span>

				<span className="mt-1 flex items-center justify-end gap-2 text-s text-muted-foreground">
					{owner}
					<ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
				</span>
			</span>
		</Link>
	</li>
);

function ActionIcon({ type }: { type: CashActionType }) {
	const Icon = ACTION_ICONS[type];

	return <Icon aria-hidden className="size-4 text-primary" />;
}
