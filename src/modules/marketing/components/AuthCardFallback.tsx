type AuthCardFallbackProps = {
	title: string;
};

export const AuthCardFallback = ({ title }: AuthCardFallbackProps) => (
	<div className="w-full max-w-md rounded-lg border border-border bg-panel p-6 shadow-panel">
		<p className="text-s+ uppercase tracking-normal text-primary">CashLift</p>

		<h1 className="mt-2 text-4xl+ tracking-normal text-panel-foreground">{title}</h1>

		<div className="mt-6 space-y-3" aria-hidden>
			<div className="h-10 rounded-md bg-panel-muted" />

			<div className="h-10 rounded-md bg-panel-muted" />

			<div className="h-10 rounded-md bg-primary/20" />
		</div>
	</div>
);
