import { MainContent } from "@/ui/components/layout/MainContent";
import { HelpFaqSection } from "./HelpFaqSection";

type HelpPageProps = {
	initialQuery?: string;
};

export const HelpPage = ({ initialQuery }: HelpPageProps) => (
	<MainContent variant="marketing">
		<HelpFaqSection initialQuery={initialQuery} />
	</MainContent>
);
