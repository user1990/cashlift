import { ArrowRight } from "lucide-react";
import { ActionLink } from "./ActionLink";

export const HomeFinalCtaSection = () => (
	<section className="relative overflow-hidden bg-shell-band">
		<div
			aria-hidden
			className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,color-mix(in_srgb,var(--highlight)_15%,transparent),transparent_42%)]"
		/>

		<div className="relative mx-auto max-w-295 px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
			<p className="font-semibold text-primary text-s+ uppercase tracking-normal">Your cash decisions</p>

			<h2 className="mx-auto mt-3 max-w-3xl text-4xl+ text-shell-foreground tracking-normal sm:text-6xl+">
				See what CashLift would put first.
			</h2>

			<p className="mx-auto mt-5 max-w-xl text-l text-shell-muted leading-8">
				Walk through the Studio Nova demo with your own approval, collection, and renewal questions in mind.
			</p>

			<ActionLink href="/demo" prefetch={false} className="mt-8">
				Book an audit walkthrough
				<ArrowRight aria-hidden className="size-4" />
			</ActionLink>
		</div>
	</section>
);
