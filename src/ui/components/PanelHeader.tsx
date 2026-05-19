type PanelHeaderProps = {
	title: string;
	action?: React.ReactNode;
	label?: string;
};

export const PanelHeader = ({ action, label, title }: PanelHeaderProps) => (
	<div className="mb-4 flex items-start justify-between gap-4">
		<div>
			{label && <p className="mb-1 text-2xs+ uppercase tracking-normal text-muted-foreground">{label}</p>}

			<h2 className="text-l+ text-panel-foreground">{title}</h2>
		</div>

		{action}
	</div>
);
