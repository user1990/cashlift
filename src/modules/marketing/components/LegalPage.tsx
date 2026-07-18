import { MainContent } from "@/modules/page-shell/components/MainContent";
import { LegalContentSection } from "./LegalContentSection";

type LegalPageProps = {
	title: string;
};

export const LegalPage = ({ title }: LegalPageProps) => (
	<MainContent variant="marketing">
		<LegalContentSection title={title} />
	</MainContent>
);
