import { MainContent } from "@/modules/page-shell/components/MainContent";
import { Panel } from "@/ui/components/Panel";
import type { USE_CASES } from "../content";
import { MarketingActionLink } from "./MarketingActionLink";
import { MarketingHero } from "./MarketingHero";

type UseCasePageProps = {
	useCase: (typeof USE_CASES)[keyof typeof USE_CASES];
};

export const UseCasePage = ({ useCase }: UseCasePageProps) => (
	<MainContent variant="marketing">
		<MarketingHero description={useCase.description} label={useCase.label} title={useCase.headline} />

		<ul className="mt-10 grid gap-4 md:grid-cols-3">
			{useCase.answers.map((answer) => (
				<li key={answer}>
					<Panel as="article">
						<p className="text-m+ text-panel-foreground">{answer}</p>
					</Panel>
				</li>
			))}
		</ul>

		<MarketingActionLink href="/demo" className="mt-8">
			Run use-case demo
		</MarketingActionLink>
	</MainContent>
);
