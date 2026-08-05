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
	</MainContent>
);
