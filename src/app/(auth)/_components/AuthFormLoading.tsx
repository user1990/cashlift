type AuthFormLoadingProps = {
	title: string;
};

export const AuthFormLoading = ({ title }: AuthFormLoadingProps) => (
	<div
		aria-busy="true"
		aria-label="Preparing authentication"
		className="w-full max-w-sm rounded-xl border border-border bg-panel p-6 text-panel-foreground shadow-panel"
		role="status"
	>
		<div className="text-center">
			<h1 className="text-xl font-semibold">{title}</h1>

			<p className="mt-2 text-sm text-muted-foreground">Secure access to your company workspace</p>
		</div>

		<div aria-hidden className="mt-6 animate-pulse space-y-4 motion-reduce:animate-none">
			<div className="h-10 rounded-md bg-panel-muted" />

			<div className="flex items-center gap-3">
				<div className="h-px flex-1 bg-border" />

				<div className="h-3 w-8 rounded bg-panel-muted" />

				<div className="h-px flex-1 bg-border" />
			</div>

			<div className="space-y-2">
				<div className="h-3 w-24 rounded bg-panel-muted" />

				<div className="h-10 rounded-md bg-panel-muted" />
			</div>

			<div className="h-10 rounded-md bg-primary-muted" />
		</div>
	</div>
);
