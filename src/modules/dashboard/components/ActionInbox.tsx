import { ArrowRight, CircleDollarSign, ReceiptText, ShieldCheck, TrendingUp } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/modules/money/format";
import { Badge } from "@/ui/components/Badge";
import { getCashActionDestination } from "../cashActionDestination";
import type { DashboardViewModel } from "../types";
import { DashboardPanel } from "./DashboardPanel";

type ActionInboxProps = {
	actions: DashboardViewModel["actionInbox"];
	basePath: string;
};

type CashActionType = DashboardViewModel["actionInbox"][number]["type"];

const ACTION_LABELS = {
	approval: "Approve spend",
	"cash-buffer": "Protect buffer",
	collection: "Recover cash",
	forecast: "Review forecast",
	"vendor-leak": "Cut waste",
} as const satisfies Record<CashActionType, string>;

export const ActionInbox = ({ actions, basePath }: ActionInboxProps) => (
	<DashboardPanel label="Today's inbox" title="Ranked by cash impact and urgency">
		{actions.length ? (
			<ol className="divide-y divide-border">
				{actions.map((action, index) => (
					<li key={action.id}>
						<Link
							className="group grid gap-4 py-4 transition-colors first:pt-0 last:pb-0 hover:text-primary sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center"
							href={getCashActionDestination(action.type, basePath)}
						>
							<span className="grid size-10 place-items-center rounded-full bg-primary-muted font-mono text-s font-semibold text-primary">
								{index + 1}
							</span>

							<span className="min-w-0">
								<span className="mb-1.5 flex flex-wrap items-center gap-2">
									<ActionIcon type={action.type} />

									<Badge variant={action.priority === "critical" ? "danger" : "warning"}>{action.priority}</Badge>

									<span className="text-s font-semibold text-muted-foreground">{ACTION_LABELS[action.type]}</span>
								</span>

								<span className="block text-m+ font-semibold text-panel-foreground group-hover:text-primary">
									{action.title}
								</span>

								<span className="mt-1 block text-m leading-6 text-muted-foreground">{action.description}</span>
							</span>

							<span className="flex items-center justify-between gap-3 sm:block sm:text-right">
								<span className="block font-mono text-m+ font-semibold text-panel-foreground">
									{formatCurrency(action.impactCents)}
								</span>

								<span className="mt-1 flex items-center justify-end gap-2 text-s text-muted-foreground">
									{action.owner}
									<ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
								</span>
							</span>
						</Link>
					</li>
				))}
			</ol>
		) : (
			<p className="rounded-lg border border-border bg-panel-muted p-4 text-m text-muted-foreground">
				You are clear for today. New cash decisions will appear here.
			</p>
		)}
	</DashboardPanel>
);

function ActionIcon({ type }: { type: CashActionType }) {
	const Icon =
		type === "approval"
			? ShieldCheck
			: type === "collection"
				? CircleDollarSign
				: type === "vendor-leak"
					? ReceiptText
					: TrendingUp;

	return <Icon aria-hidden className="size-4 text-primary" />;
}
