import { ArrowRight } from "lucide-react";
import { ActionLink } from "./ActionLink";

export const HomeFinalCtaSection = () => (
	<section aria-labelledby="home-final-cta-title" className="relative overflow-hidden bg-shell-band">
		<div
			aria-hidden
			className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,color-mix(in_srgb,var(--highlight)_15%,transparent),transparent_42%)]"
		/>

		<div className="relative mx-auto flex max-w-295 flex-col items-center px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-24">
			<h2 id="home-final-cta-title" className="text-5xl+ text-primary tracking-normal sm:text-7xl+">
				Your cash decisions
			</h2>

			<p className="mt-4 text-l text-shell-muted leading-8">Ready to see your top actions for today?</p>

			<ActionLink href="/demo/workspace" prefetch={false} className="mt-8">
				Open live demo
				<ArrowRight aria-hidden className="size-4" />
			</ActionLink>
		</div>
	</section>
);
