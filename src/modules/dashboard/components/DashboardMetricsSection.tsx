import { ArrowDown, ArrowUp, ShieldCheck, Wallet, WalletCards } from "lucide-react";
import { formatPreciseCompactCurrency } from "@/modules/money/format";
import { Panel } from "@/ui/components/Panel";
import type { DashboardViewModel } from "../types";

type DashboardMetricsSectionProps = {
	dashboard: DashboardViewModel;
};

export const DashboardMetricsSection = ({ dashboard }: DashboardMetricsSectionProps) => (
	<Panel className="grid gap-0 p-0 md:grid-cols-2 xl:grid-cols-4">
		<MetricItem
			direction="up"
			icon={<Wallet aria-hidden className="size-5" />}
			label="Cash on hand"
			trend="8.2% vs last 7 days"
			value={formatPreciseCompactCurrency(dashboard.cashAvailableCents)}
			variant="primary"
		/>

		<MetricItem
			direction="up"
			icon={<WalletCards aria-hidden className="size-5" />}
			label="Committed spend"
			trend="12.4% vs last 7 days"
			value={formatPreciseCompactCurrency(dashboard.totalCommittedSpendCents)}
			variant="highlight"
		/>

		<MetricItem
			direction="down"
			icon={<WalletCards aria-hidden className="size-5" />}
			label="Uncommitted"
			trend="4.6% vs last 7 days"
			value={formatPreciseCompactCurrency(dashboard.totalUncommittedCents)}
			variant="violet"
		/>

		<MetricItem
			direction="up"
			icon={<ShieldCheck aria-hidden className="size-5" />}
			label="At risk"
			trend="5.1% vs last 7 days"
			value={formatPreciseCompactCurrency(dashboard.invoiceRiskCents)}
			variant="warning"
		/>
	</Panel>
);

type MetricItemProps = {
	direction: "down" | "up";
	icon: React.ReactNode;
	label: string;
	trend: string;
	value: string;
	variant: "highlight" | "primary" | "violet" | "warning";
};

const MetricItem = ({ direction, icon, label, trend, value, variant }: MetricItemProps) => (
	<article className="flex gap-4 border-shell-border/60 p-6 md:[&:nth-child(even)]:border-l xl:border-l xl:first:border-l-0">
		<div className={getMetricIconClassName(variant)}>{icon}</div>

		<div>
			<p className="text-m text-shell-muted">{label}</p>

			<p className="mt-2 font-mono text-3xl+ font-semibold tracking-normal text-panel-foreground">{value}</p>

			<p className={getTrendClassName(direction)}>
				{direction === "up" ? <ArrowUp aria-hidden className="size-4" /> : <ArrowDown aria-hidden className="size-4" />}
				{trend}
			</p>
		</div>
	</article>
);

function getMetricIconClassName(variant: MetricItemProps["variant"]) {
	const variants = {
		highlight: "bg-highlight-subtle text-highlight",
		primary: "bg-primary-subtle text-primary",
		violet: "bg-violet-subtle text-violet",
		warning: "bg-warning-subtle text-warning",
	} as const satisfies Record<MetricItemProps["variant"], string>;

	return `grid size-12 shrink-0 place-items-center rounded-lg ${variants[variant]}`;
}

function getTrendClassName(direction: MetricItemProps["direction"]) {
	return `mt-2 inline-flex items-center gap-1 text-s+ ${direction === "up" ? "text-signal" : "text-red-400"}`;
}
