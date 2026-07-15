const DEMO_OUTCOMES = [
	{ label: "prioritized cash actions", value: "3" },
	{ label: "overdue collection risk", value: "$126.5k" },
	{ label: "monthly vendor savings", value: "$23k" },
] as const;

export const HomeDemoOutcomesSection = () => (
	<section className="border-b border-shell-border bg-shell-band" aria-labelledby="demo-outcomes-title">
		<div className="mx-auto max-w-[1180px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
			<div className="overflow-hidden rounded-xl border border-shell-border bg-shell-elevated shadow-shell lg:grid lg:grid-cols-[1.15fr_2fr]">
				<div className="p-6 sm:p-8">
					<div className="flex flex-wrap items-center gap-3">
						<p className="text-s+ font-semibold uppercase tracking-normal text-primary">Inside the live demo</p>

						<span className="rounded-full border border-primary-subtle-border bg-primary-subtle px-2.5 py-1 text-2xs+ font-semibold uppercase tracking-normal text-primary">
							Illustrative data
						</span>
					</div>

					<h2 id="demo-outcomes-title" className="mt-4 text-3xl+ tracking-normal text-shell-foreground">
						Meet Studio Nova
					</h2>

					<p className="mt-3 max-w-md text-m+ leading-7 text-shell-muted">
						Studio Nova is a fictional services company used to demonstrate CashLift with realistic, illustrative data.
					</p>
				</div>

				<dl className="grid divide-y divide-shell-border border-t border-shell-border sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:border-l lg:border-t-0">
					{DEMO_OUTCOMES.map(({ label, value }) => (
						<div key={label} className="flex flex-col justify-center p-6 sm:p-7">
							<dt className="text-m leading-6 text-shell-muted">{label}</dt>

							<dd className="order-first mb-3 font-mono text-3xl+ text-shell-foreground">{value}</dd>
						</div>
					))}
				</dl>
			</div>
		</div>
	</section>
);
