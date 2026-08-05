import { ArrowRight } from "lucide-react";
import { ActionLink } from "./ActionLink";

export const HomeFinalCtaSection = () => (
	<section aria-labelledby="home-final-cta-title" className="relative overflow-hidden bg-shell-band">
		<div
			aria-hidden
			className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,color-mix(in_srgb,var(--highlight)_15%,transparent),transparent_42%)]"
		/>

		<div className="relative mx-auto grid max-w-295 items-center gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8 lg:py-16">
			<div>
				<h2 id="home-final-cta-title" className="max-w-2xl text-5xl+ text-primary tracking-normal sm:text-7xl+">
					Your cash decisions
				</h2>

				<p className="mt-4 max-w-xl text-l text-shell-muted leading-8">Ready to see your top actions for today?</p>
			</div>

			<ActionLink href="/demo/workspace" prefetch={false}>
				Open live demo
				<ArrowRight aria-hidden className="size-4" />
			</ActionLink>
		</div>
	</section>
);
