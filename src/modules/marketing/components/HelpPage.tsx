import { MainContent } from "@/modules/page-shell/components/MainContent";
import { HelpFaqSection } from "./HelpFaqSection";

type HelpPageProps = {
	initialQuery?: string;
};

export const HelpPage = ({ initialQuery }: HelpPageProps) => (
	<MainContent variant="marketing">
		<HelpFaqSection initialQuery={initialQuery} />
	</MainContent>
);
