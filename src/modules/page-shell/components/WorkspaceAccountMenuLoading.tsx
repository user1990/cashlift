type WorkspaceAccountMenuLoadingProps = {
	compact?: boolean;
};

export const WorkspaceAccountMenuLoading = ({ compact = false }: WorkspaceAccountMenuLoadingProps) => (
	<div
		aria-busy="true"
		aria-label="Preparing account menu"
		className={compact ? "flex size-11 items-center justify-center" : "flex w-full items-center gap-3 px-2 py-3"}
		role="status"
	>
		<span
			aria-hidden
			className="size-10 shrink-0 animate-pulse rounded-full bg-panel-muted motion-reduce:animate-none"
		/>

		{!compact && (
			<span aria-hidden className="min-w-0 flex-1 animate-pulse space-y-2 motion-reduce:animate-none">
				<span className="block h-3 w-24 rounded bg-panel-muted" />

				<span className="block h-3 w-32 rounded bg-panel-muted" />
			</span>
		)}
	</div>
);
