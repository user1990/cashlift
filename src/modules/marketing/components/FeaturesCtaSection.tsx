import { ArrowRight } from "lucide-react";
import { FEATURES_PAGE } from "../site";
import { ActionLink } from "./ActionLink";

export const FeaturesCtaSection = () => (
	<section className="mx-auto flex max-w-295 flex-col gap-4 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
		<header>
			<p className="text-primary text-s+ uppercase tracking-normal">{FEATURES_PAGE.ctaKicker}</p>

			<h2 className="mt-2 text-4xl+ text-shell-foreground tracking-normal">{FEATURES_PAGE.ctaTitle}</h2>
		</header>

		<ActionLink href={FEATURES_PAGE.ctaHref}>
			{FEATURES_PAGE.ctaButton}
			<ArrowRight aria-hidden className="size-4" />
		</ActionLink>
	</section>
);
