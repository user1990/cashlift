import { Panel } from "@/modules/ui/components/Panel";

type MetricCardProps = {
	accent?: "highlight";
	icon: React.ReactNode;
	label: string;
	meta: string;
	value: string;
};

export const MetricCard = ({ accent, icon, label, meta, value }: MetricCardProps) => (
	<Panel as="article" variant={accent === "highlight" ? "accent" : "light"}>
		<div className="flex items-start justify-between gap-4">
			<dl>
				<dt className="text-m font-medium text-muted-foreground">{label}</dt>

				<dd className="mt-2 font-mono text-5xl+ tracking-normal text-panel-foreground">{value}</dd>

				<p className="mt-2 max-w-sm text-m leading-5 text-muted-foreground">{meta}</p>
			</dl>

			<div className="rounded-lg border border-border bg-panel p-2 text-primary">{icon}</div>
		</div>
	</Panel>
);
