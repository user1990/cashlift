import Link from "next/link";
import { MainContent } from "@/modules/page-shell/components/MainContent";
import { HOME_NOSCRIPT } from "../site";
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
				<h2 className="text-3xl+ text-primary tracking-normal">{HOME_NOSCRIPT.title}</h2>

				<p className="mt-4 max-w-4xl text-shell-muted leading-7">{HOME_NOSCRIPT.body}</p>

				<p className="mt-4 text-shell-muted leading-7">
					<Link href={HOME_NOSCRIPT.demoLinkHref} className="text-primary">
						{HOME_NOSCRIPT.demoLinkLabel}
					</Link>{" "}
					or read the{" "}
					<Link href={HOME_NOSCRIPT.helpLinkHref} className="text-primary">
						{HOME_NOSCRIPT.helpLinkLabel}
					</Link>
					.
				</p>
			</section>
		</noscript>
	</MainContent>
);
