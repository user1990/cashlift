export const BudgetLegend = () => (
	<div className="flex flex-wrap items-center gap-4 text-s+ text-shell-muted">
		<span className="inline-flex items-center gap-2">
			<span className="size-3 rounded-full bg-primary" />
			Budget used
		</span>

		<span className="inline-flex items-center gap-2">
			<span className="size-3 rounded-full bg-highlight" />
			Remaining
		</span>
	</div>
);
