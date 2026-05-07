export const ChartPlaceholder = () => (
	<div className="flex h-full min-h-0 items-end gap-2 rounded-lg bg-[#FAFAFA] p-4">
		{[48, 72, 56, 84, 68].map((height) => (
			<div
				className="flex-1 rounded-t-md bg-indigo-100"
				key={height}
				style={{ height: `${height}%` }}
			/>
		))}
	</div>
);
