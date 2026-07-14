const DEMO_OUTCOMES = [
	{ label: "prioritized cash actions", value: "3" },
	{ label: "overdue collection risk", value: "$126.5k" },
	{ label: "monthly vendor savings", value: "$23k" },
] as const;

export const HomeDemoOutcomesSection = () => (
	<section className="border-b border-shell-border bg-shell-band" aria-labelledby="demo-outcomes-title">
		<div className="mx-auto max-w-[1180px] px-4 py-10 sm:px-6 lg:px-8">
			<p id="demo-outcomes-title" className="text-center text-s+ uppercase tracking-normal text-shell-muted">
				Studio Nova demo outcomes · illustrative
			</p>

			<dl className="mt-7 grid gap-6 sm:grid-cols-3 sm:divide-x sm:divide-shell-border">
				{DEMO_OUTCOMES.map(({ label, value }) => (
					<div key={label} className="text-center">
						<dt className="text-m text-shell-muted">{label}</dt>

						<dd className="mt-2 font-mono text-3xl+ text-shell-foreground">{value}</dd>
					</div>
				))}
			</dl>
		</div>
	</section>
);
