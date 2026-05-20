import type { ReactNode } from "react";
import { Panel, PanelHeader } from "@/ui/components/Panel";

type WorkspaceMetricCardProps = {
	label: string;
	title: string;
	value: ReactNode;
	as?: "article" | "div";
	description?: ReactNode;
	valueClassName?: string;
};

export const WorkspaceMetricCard = ({
	as = "div",
	description,
	label,
	title,
	value,
	valueClassName = "font-mono text-5xl+ text-panel-foreground",
}: WorkspaceMetricCardProps) => (
	<Panel as={as}>
		<PanelHeader label={label} title={title} />

		<dl>
			<dt className="sr-only">{title}</dt>

			<dd className={valueClassName}>{value}</dd>
		</dl>

		{description && <p className="mt-2 text-m text-muted-foreground">{description}</p>}
	</Panel>
);
