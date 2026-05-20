import type { ReactNode } from "react";
import { Panel, PanelHeader } from "@/ui/components/Panel";
import { cn } from "@/ui/utils/cn";

type DashboardPanelProps = {
	children: ReactNode;
	label: string;
	title: string;
	action?: ReactNode;
	className?: string;
};

export const DashboardPanel = ({ action, children, className, label, title }: DashboardPanelProps) => (
	<Panel className={cn("min-h-96 p-6", className)}>
		<PanelHeader action={action} label={label} title={title} />

		{children}
	</Panel>
);
