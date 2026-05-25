import { MainContent } from "@/modules/page-shell/components/MainContent";
import { LegalContentSection } from "./LegalContentSection";

type LegalPageProps = {
	title: string;
};

export const LegalPage = ({ title }: LegalPageProps) => (
	<MainContent variant="marketing" className="max-w-[820px]">
		<LegalContentSection title={title} />
	</MainContent>
);
