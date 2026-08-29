import { ArrowRight } from "lucide-react";
import { ActionLink } from "./ActionLink";

export const FeaturesCtaSection = () => (
	<section className="mx-auto flex max-w-295 flex-col gap-4 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
		<header>
			<p className="text-primary text-s+ uppercase tracking-normal">Get started</p>

			<h2 className="mt-2 text-4xl+ text-shell-foreground tracking-normal">
				See the product in action or run a leak audit.
			</h2>
		</header>

		<ActionLink href="/demo">
			Book a walkthrough
			<ArrowRight aria-hidden className="size-4" />
		</ActionLink>
	</section>
);
