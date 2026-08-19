import type { ReactNode } from "react";
import { Panel } from "@/ui/components/layout/Panel";
import { cn } from "@/ui/utils/cn";

type DashboardPanelProps = {
	children: ReactNode;
	label: string;
	title: string;
	action?: ReactNode;
	className?: string;
};

export const DashboardPanel = ({ action, children, className, label, title }: DashboardPanelProps) => (
	<Panel className={cn("p-5", className)}>
		<div className="mb-4 flex items-start justify-between gap-4">
			<div className="min-w-0">
				<p className="text-s text-muted-foreground">{label}</p>

				<h2 className="mt-1 text-l+ text-panel-foreground">{title}</h2>
			</div>

			{action && <div className="shrink-0">{action}</div>}
		</div>

		{children}
	</Panel>
);
