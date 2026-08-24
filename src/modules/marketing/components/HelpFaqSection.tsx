import { HELP_FAQ_GROUPS } from "../content";
import { HelpFaqCatalog } from "./HelpFaqCatalog";
import { Hero } from "./Hero";

type HelpFaqSectionProps = {
	initialQuery?: string;
};

export const HelpFaqSection = ({ initialQuery = "" }: HelpFaqSectionProps) => (
	<section aria-label="Help and FAQ">
		<Hero
			description="Find answers to common questions about CashLift."
			label="Help"
			variant="page-title"
			titleClassName="text-4xl sm:text-5xl"
			className="max-w-3xl [&>p]:mt-2 [&>p]:text-l [&>p]:leading-6"
		/>

		<HelpFaqCatalog groups={HELP_FAQ_GROUPS} initialQuery={initialQuery} />
	</section>
);
