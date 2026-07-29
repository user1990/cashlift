import { CirclePlay, ShieldCheck } from "lucide-react";
import { ActionLink } from "./ActionLink";

export const DemoOverviewSection = () => (
	<section className="min-w-0">
		<p className="text-primary text-xl+ uppercase tracking-normal">Audit walkthrough</p>

		<h1
			aria-label="See the cash leak. Understand the impact. Know what to do next."
			className="mt-4 text-4xl+ text-shell-foreground tracking-[-0.035em] sm:text-5xl+ lg:text-6xl+ xl:text-7xl+"
		>
			<span className="block">See the cash leak. </span>

			<span className="mt-3 block">Understand the impact. </span>

			<span className="mt-3 block">Know what to do next.</span>
		</h1>

		<p className="mt-8 max-w-2xl text-l text-shell-muted leading-7">
			We’ll use the Studio Nova workspace to turn approval, collection, and renewal questions into a ranked action plan.
		</p>

		<div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
			<ActionLink href="/demo/workspace" prefetch={false} className="w-fit">
				<CirclePlay aria-hidden className="size-5" />

				<span>Open live demo</span>
			</ActionLink>

			<p className="flex items-center gap-2 text-m text-shell-muted">
				<ShieldCheck aria-hidden className="size-5 shrink-0" />
				Realistic mock data. No setup.
			</p>
		</div>
	</section>
);
