export const ChartPlaceholder = () => (
	<div className="flex h-full min-h-0 items-end gap-2 rounded-lg bg-panel-muted p-4">
		{[48, 72, 56, 84, 68].map((height) => (
			<div key={height} className="flex-1 rounded-t-md bg-primary-muted" style={{ height: `${height}%` }} />
		))}
	</div>
);
