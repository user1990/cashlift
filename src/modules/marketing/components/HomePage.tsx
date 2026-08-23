import { MainContent } from "@/modules/page-shell/components/MainContent";
import type { HomeDecisionStoryAction } from "../types";
import { HomeDecisionStorySection } from "./HomeDecisionStorySection";
import { HomeFaqSection } from "./HomeFaqSection";
import { HomeFinalCtaSection } from "./HomeFinalCtaSection";
import { HomeHeroSection } from "./HomeHeroSection";

type HomePageProps = {
	actions: HomeDecisionStoryAction[];
};

export const HomePage = ({ actions }: HomePageProps) => (
	<MainContent variant="plain">
		<HomeHeroSection />

		<HomeDecisionStorySection actions={actions} />

		<HomeFaqSection />

		<HomeFinalCtaSection />

		<noscript>
			<section className="mx-auto max-w-295 border-shell-border border-t px-4 py-12 text-shell-foreground sm:px-6 lg:px-8">
				<h2 className="text-3xl+ text-primary tracking-normal">CashLift cash operations overview</h2>

				<p className="mt-4 max-w-4xl text-shell-muted leading-7">
					CashLift is a demo-first cash operations workspace for service firms. It ranks the actions that need attention
					today so owners and teams can decide what to collect, approve, or cut. The workflow brings overdue invoice
					collection, spend approvals, vendor leak detection, cash-buffer warnings, and a 13-week cash outlook together
					in one daily inbox. Each action keeps its cash impact, urgency, owner, and supporting context beside the
					recommended next step. The Studio Nova live demo is read-only, does not require an account, and does not move
					money, issue cards, or provide financial, legal, or tax advice.
				</p>

				<p className="mt-4 text-shell-muted leading-7">
					<a href="/demo/workspace" className="text-primary">
						Open the live demo
					</a>{" "}
					or read the{" "}
					<a href="/help" className="text-primary">
						CashLift help index
					</a>
					.
				</p>
			</section>
		</noscript>
	</MainContent>
);
