import { MainContent } from "@/modules/page-shell/components/MainContent";
import { HelpFaqSection } from "./HelpFaqSection";

type HelpPageProps = {
	query: string;
};

export const HelpPage = ({ query }: HelpPageProps) => (
	<MainContent variant="marketing">
		<HelpFaqSection query={query} />
	</MainContent>
);
