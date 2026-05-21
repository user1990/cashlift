import { MainContent } from "@/modules/page-shell/components/MainContent";
import type { USE_CASES } from "../content";
import { MarketingActionLink } from "./MarketingActionLink";
import { MarketingHero } from "./MarketingHero";
import { UseCaseAnswersList } from "./UseCaseAnswersList";

type UseCasePageProps = {
	useCase: (typeof USE_CASES)[keyof typeof USE_CASES];
};

export const UseCasePage = ({ useCase }: UseCasePageProps) => (
	<MainContent variant="marketing">
		<MarketingHero description={useCase.description} label={useCase.label} title={useCase.headline} />

		<UseCaseAnswersList answers={useCase.answers} />

		<MarketingActionLink href="/demo" className="mt-8">
			Run use-case demo
		</MarketingActionLink>
	</MainContent>
);
