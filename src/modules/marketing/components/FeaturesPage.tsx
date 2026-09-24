import { MainContent } from "@/ui/components/layout/MainContent";
import { FeaturesCtaSection } from "./FeaturesCtaSection";
import { FeaturesDemoStepsSection } from "./FeaturesDemoStepsSection";
import { FeaturesHeroSection } from "./FeaturesHeroSection";

export const FeaturesPage = () => (
	<MainContent variant="plain">
		<FeaturesHeroSection />

		<FeaturesDemoStepsSection />

		<FeaturesCtaSection />
	</MainContent>
);
