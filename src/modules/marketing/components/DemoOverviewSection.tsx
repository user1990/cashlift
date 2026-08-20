import { CirclePlay, ShieldCheck } from "lucide-react";
import { ActionLink } from "./ActionLink";
import { Hero } from "./Hero";

export const DemoOverviewSection = () => (
	<section className="min-w-0">
		<Hero
			description="We’ll use the Studio Nova workspace to turn approval, collection, and renewal questions into a ranked action plan."
			label="See the cash leak. Understand the impact. Know what to do next."
			variant="page-title"
		/>

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
