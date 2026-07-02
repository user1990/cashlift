import { Badge } from "@/ui/components/Badge";

type PanelHeaderProps = {
	title: string;
	action?: React.ReactNode;
	label?: string;
};

export const PanelHeader = ({ action, label, title }: PanelHeaderProps) => (
	<div className="mb-4 flex items-start justify-between gap-4">
		<div>
			{label && <Badge className="mb-1">{label}</Badge>}

			<h2 className="text-l+ text-panel-foreground">{title}</h2>
		</div>

		{action}
	</div>
);
