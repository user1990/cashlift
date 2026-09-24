import { MainContent } from "@/ui/components/layout/MainContent";
import type { PricingBilling } from "../content";
import { PricingComparisonSection } from "./PricingComparisonSection";
import { PricingPlansSection } from "./PricingPlansSection";

type PricingPageProps = {
	billing?: PricingBilling;
};

export const PricingPage = ({ billing = "annual" }: PricingPageProps) => (
	<MainContent variant="marketing">
		<PricingPlansSection billing={billing} />

		<PricingComparisonSection />
	</MainContent>
);
