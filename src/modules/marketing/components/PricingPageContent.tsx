import type { PricingBilling } from "../content";
import { PricingComparisonSection } from "./PricingComparisonSection";
import { PricingHeroSection } from "./PricingHeroSection";
import { PricingPlansSection } from "./PricingPlansSection";
import { PricingTrustNotes } from "./PricingTrustNotes";

type PricingPageContentProps = {
	billing: PricingBilling;
};

export const PricingPageContent = ({ billing }: PricingPageContentProps) => (
	<>
		<section className="min-w-0" aria-labelledby="pricing-heading">
			<PricingHeroSection billing={billing} />

			<PricingPlansSection billing={billing} />

			<PricingTrustNotes />
		</section>

		<PricingComparisonSection />
	</>
);
