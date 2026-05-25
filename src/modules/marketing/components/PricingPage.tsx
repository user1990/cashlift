import { MainContent } from "@/modules/page-shell/components/MainContent";
import { PricingHeroSection } from "./PricingHeroSection";
import { PricingPlansSection } from "./PricingPlansSection";

export const PricingPage = () => (
	<MainContent variant="marketing">
		<PricingHeroSection />

		<PricingPlansSection />
	</MainContent>
);
