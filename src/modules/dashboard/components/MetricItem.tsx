import { cn } from "@/ui/utils/cn";

type MetricItemProps = {
	detail: string;
	label: string;
	value: string;
	warning?: boolean;
};

export const MetricItem = ({ detail, label, value, warning = false }: MetricItemProps) => (
	<article className="border-shell-border/60 border-b p-5 last:border-b-0 md:border-b-0 md:border-l md:first:border-l-0">
		<p className="text-m text-shell-muted">{label}</p>

		<p
			className={cn(
				"mt-2 font-mono font-semibold text-3xl+ tracking-normal",
				warning ? "text-warning" : "text-panel-foreground",
			)}
		>
			{value}
		</p>

		<p className="mt-2 text-s+ text-shell-muted">{detail}</p>
	</article>
);
