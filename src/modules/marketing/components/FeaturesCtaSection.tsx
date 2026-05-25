import { ArrowRight } from "lucide-react";
import { ActionLink } from "./ActionLink";

export const FeaturesCtaSection = () => (
	<section className="mx-auto flex max-w-[1180px] flex-col gap-4 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
		<div>
			<p className="text-s+ uppercase tracking-normal text-primary">Get started</p>

			<h2 className="mt-2 text-4xl+ tracking-normal text-shell-foreground">
				Open the product demo or run a leak audit.
			</h2>
		</div>

		<ActionLink href="/demo">
			See demo
			<ArrowRight aria-hidden className="size-4" />
		</ActionLink>
	</section>
);
