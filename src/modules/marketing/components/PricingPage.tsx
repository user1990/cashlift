import { MainContent } from "@/modules/page-shell/components/MainContent";
import type { PricingBilling } from "../content";
import { PricingComparisonSection } from "./PricingComparisonSection";
import { PricingHeroSection } from "./PricingHeroSection";
import { PricingPlansSection } from "./PricingPlansSection";
import { PricingTrustNotes } from "./PricingTrustNotes";

type PricingPageProps = {
	billing?: PricingBilling;
};

export const PricingPage = ({ billing = "annual" }: PricingPageProps) => (
	<MainContent variant="marketing">
		<section>
			<PricingHeroSection billing={billing} />

			<PricingPlansSection billing={billing} />

			<PricingTrustNotes />
		</section>

		<PricingComparisonSection />
	</MainContent>
);
