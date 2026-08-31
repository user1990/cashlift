import { MainContent } from "@/modules/page-shell/components/MainContent";
import type { USE_CASES } from "../content";
import { Hero } from "./Hero";
import { UseCaseAnswers } from "./UseCaseAnswers";
import { UseCaseDemoCtaSection } from "./UseCaseDemoCtaSection";

type UseCasePageProps = {
	useCase: (typeof USE_CASES)[keyof typeof USE_CASES];
	answersVariant?: "default" | "glass";
};

export const UseCasePage = ({ answersVariant = "default", useCase }: UseCasePageProps) => (
	<MainContent variant="marketing">
		<Hero description={useCase.description} label={useCase.label} variant="page-title" />

		<UseCaseAnswers answers={useCase.answers} variant={answersVariant} />

		<UseCaseDemoCtaSection />
	</MainContent>
);
