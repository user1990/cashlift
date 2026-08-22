import { HELP_FAQ_GROUPS } from "../content";
import { ActionLink } from "./ActionLink";
import { HelpFaqCatalog } from "./HelpFaqCatalog";
import { Hero } from "./Hero";

type HelpFaqSectionProps = {
	initialQuery?: string;
};

export const HelpFaqSection = ({ initialQuery = "" }: HelpFaqSectionProps) => (
	<section aria-label="Help and FAQ">
		<Hero
			description="Search the answers behind CashLift’s demo, workspace, plans, and first steps."
			label="Help"
			labelAsHeading
			title="Find the answer before the cash decision."
			className="max-w-3xl"
		/>

		<HelpFaqCatalog groups={HELP_FAQ_GROUPS} initialQuery={initialQuery} />

		<div className="mt-8 flex flex-wrap items-center gap-4 border-shell-border border-t pt-6">
			<ActionLink href="/contact" variant="secondary">
				Talk to us
			</ActionLink>

			<p className="text-m text-shell-muted">Can’t find what you need? Use the existing contact page.</p>
		</div>
	</section>
);
