const BAR_CLASS_NAMES = ["h-[48%]", "h-[72%]", "h-[56%]", "h-[84%]", "h-[68%]"] as const;

export const ChartPlaceholder = () => (
	<div className="flex h-full min-h-0 items-end gap-2 rounded-lg bg-panel-muted p-4">
		{BAR_CLASS_NAMES.map((className) => (
			<div key={className} className={`flex-1 rounded-t-md bg-primary-muted ${className}`} />
		))}
	</div>
);
