import { MainContent } from "@/modules/page-shell/components/MainContent";
import type { PricingBilling } from "../content";
import { PricingPageContent } from "./PricingPageContent";

type PricingPageProps = {
	initialBilling?: PricingBilling;
};

export const PricingPage = ({ initialBilling = "annual" }: PricingPageProps) => (
	<MainContent variant="marketing" className="w-full min-w-0 max-w-[1240px] lg:py-10">
		<PricingPageContent initialBilling={initialBilling} />
	</MainContent>
);
