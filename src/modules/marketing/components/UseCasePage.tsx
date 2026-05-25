import { MainContent } from "@/modules/page-shell/components/MainContent";
import type { USE_CASES } from "../content";
import { ActionLink } from "./ActionLink";
import { Hero } from "./Hero";
import { UseCaseAnswers } from "./UseCaseAnswers";

type UseCasePageProps = {
	useCase: (typeof USE_CASES)[keyof typeof USE_CASES];
};

export const UseCasePage = ({ useCase }: UseCasePageProps) => (
	<MainContent variant="marketing">
		<Hero description={useCase.description} label={useCase.label} labelAsHeading title={useCase.headline} />

		<UseCaseAnswers answers={useCase.answers} />

		<ActionLink href="/demo" className="mt-8">
			Run use-case demo
		</ActionLink>
	</MainContent>
);
