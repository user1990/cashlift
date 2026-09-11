import { CirclePlay, ShieldCheck } from "lucide-react";
import { DEMO_PAGE } from "../site";
import { ActionLink } from "./ActionLink";
import { Hero } from "./Hero";

export const DemoOverviewSection = () => (
	<section className="flex min-w-0 flex-col justify-center">
		<Hero description={DEMO_PAGE.description} label={DEMO_PAGE.label} variant="page-title" />

		<div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
			<ActionLink href={DEMO_PAGE.ctaDemoHref} prefetch={false} className="w-fit">
				<CirclePlay aria-hidden className="size-5" />

				<span>{DEMO_PAGE.ctaDemoLabel}</span>
			</ActionLink>

			<p className="flex items-center gap-2 text-m text-shell-muted">
				<ShieldCheck aria-hidden className="size-5 shrink-0" />
				{DEMO_PAGE.reassurance}
			</p>
		</div>
	</section>
);
