import { MainContent } from "@/modules/page-shell/components/MainContent";
import type { PricingBilling } from "../content";
import { PricingPageContent } from "./PricingPageContent";

type PricingPageProps = {
	billing?: PricingBilling;
};

export const PricingPage = ({ billing = "annual" }: PricingPageProps) => (
	<MainContent variant="marketing" className="w-full min-w-0 max-w-[1240px] lg:py-10">
		<PricingPageContent billing={billing} />
	</MainContent>
);
