import { ArrowDown, ArrowUp } from "lucide-react";
import type { ReactNode } from "react";

type MetricItemProps = {
	direction: "down" | "up";
	icon: ReactNode;
	label: string;
	trend: string;
	value: string;
	variant: "highlight" | "primary" | "violet" | "warning";
};

export const MetricItem = ({ direction, icon, label, trend, value, variant }: MetricItemProps) => (
	<article className="flex gap-4 border-shell-border/60 p-6 md:even:border-l xl:border-l xl:first:border-l-0">
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
