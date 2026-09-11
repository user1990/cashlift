import { ArrowRight } from "lucide-react";
import { HOME_FINAL_CTA } from "../site";
import { ActionLink } from "./ActionLink";

export const HomeFinalCtaSection = () => (
	<section aria-labelledby="home-final-cta-title" className="relative overflow-hidden bg-shell-band">
		<div
			aria-hidden
			className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,color-mix(in_srgb,var(--highlight)_15%,transparent),transparent_42%)]"
		/>

		<div aria-hidden className="absolute inset-x-0 bottom-0 h-24">
			<div className="absolute inset-x-[10%] bottom-0 h-16 bg-[radial-gradient(ellipse_at_50%_100%,color-mix(in_srgb,var(--primary)_42%,transparent),color-mix(in_srgb,var(--highlight)_24%,transparent)_58%,transparent_78%)] blur-2xl" />

			<div className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent_0%,color-mix(in_srgb,var(--primary)_60%,transparent)_8%,var(--primary)_47%,#b3d5ff_62%,var(--highlight)_82%,transparent_100%)]" />
		</div>

		<div className="relative mx-auto flex max-w-295 flex-col items-center px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-24">
			<h2 id="home-final-cta-title" className="text-5xl+ text-primary tracking-normal sm:text-7xl+">
				{HOME_FINAL_CTA.title}
			</h2>

			<p className="mt-4 text-l text-shell-muted leading-8">{HOME_FINAL_CTA.subtitle}</p>

			<ActionLink href={HOME_FINAL_CTA.ctaHref} prefetch={false} className="mt-8">
				{HOME_FINAL_CTA.ctaLabel}
				<ArrowRight aria-hidden className="size-4" />
			</ActionLink>
		</div>
	</section>
);
