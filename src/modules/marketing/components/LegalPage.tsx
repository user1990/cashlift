import { MainContent } from "@/modules/page-shell/components/MainContent";
import { LegalContentSection } from "./LegalContentSection";

type LegalPageProps = {
	as?: "h1" | "h2";
};

export const LegalPage = ({ as = "h1" }: LegalPageProps) => (
	<MainContent variant="marketing">
		<LegalContentSection as={as} />
	</MainContent>
);
