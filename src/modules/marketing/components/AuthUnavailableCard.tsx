export const AuthUnavailableCard = () => (
	<div className="w-full max-w-md rounded-lg border border-border bg-panel p-6 shadow-panel">
		<p className="text-s+ uppercase tracking-normal text-primary">CashLift</p>

		<h1 className="mt-2 text-4xl+ tracking-normal text-panel-foreground">Login unavailable</h1>

		<p className="mt-4 text-m leading-6 text-muted-foreground">
			Authentication is not configured for this environment yet.
		</p>
	</div>
);
