type ActionTileProps = {
	icon: React.ReactNode;
	label: string;
	meta: string;
	value: string;
};

export const ActionTile = ({ icon, label, meta, value }: ActionTileProps) => (
	<article className="rounded-lg border border-border bg-panel-muted p-3">
		<div className="mb-3 flex items-center justify-between gap-3">
			<span className="rounded-md bg-panel p-2 text-primary">{icon}</span>

			<span className="font-mono text-m+ text-panel-foreground">{value}</span>
		</div>

		<p className="text-m+ text-panel-foreground">{label}</p>

		<p className="mt-1 text-s leading-5 text-muted-foreground">{meta}</p>
	</article>
);
