import { HELP_FAQ_GROUPS } from "../content";
import { ActionLink } from "./ActionLink";
import { HelpFaqCatalog } from "./HelpFaqCatalog";
import { Hero } from "./Hero";

type HelpFaqSectionProps = {
	query: string;
};

export const HelpFaqSection = ({ query }: HelpFaqSectionProps) => (
	<>
		<Hero
			description="Filter grouped questions about the demo, company workspace, cash actions, and plans. Answers stay limited to how this MVP behaves today."
			label="Help"
			variant="page-title"
		/>

		<HelpFaqCatalog groups={HELP_FAQ_GROUPS} query={query} />

		<ActionLink href="/contact" className="mt-8">
			Contact support
		</ActionLink>
	</>
);
