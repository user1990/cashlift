import { MainContent } from "@/modules/page-shell/components/MainContent";
import { HomeDecisionStorySection } from "./HomeDecisionStorySection";
import { HomeFinalCtaSection } from "./HomeFinalCtaSection";
import { HomeHeroSection } from "./HomeHeroSection";

export const HomePage = () => (
	<MainContent variant="plain">
		<HomeHeroSection />

		<HomeDecisionStorySection />

		<HomeFinalCtaSection />
	</MainContent>
);
