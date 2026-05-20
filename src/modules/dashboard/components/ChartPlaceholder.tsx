const BAR_CLASS_NAMES = ["h-1/2", "h-3/4", "h-3/5", "h-5/6", "h-2/3"] as const;

export const ChartPlaceholder = () => (
	<div className="flex h-full min-h-0 items-end gap-2 rounded-lg bg-panel-muted p-4">
		{BAR_CLASS_NAMES.map((className) => (
			<div key={className} className={`flex-1 rounded-t-md bg-primary-muted ${className}`} />
		))}
	</div>
);
