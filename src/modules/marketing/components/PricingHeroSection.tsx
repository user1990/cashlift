import type { PricingBilling } from "../content";
import { Hero } from "./Hero";
import { PricingBillingToggle } from "./PricingBillingToggle";

type PricingHeroSectionProps = {
	billing: PricingBilling;
};

export const PricingHeroSection = ({ billing }: PricingHeroSectionProps) => (
	<div>
		<Hero
			description="Start with a free cash leak audit, then use one plan for owners, finance, managers, and request-only employees."
			label="Pricing"
			labelAsHeading
			title="Flat team plans. Invite every employee without seat anxiety."
		/>

		<div className="mt-8">
			<PricingBillingToggle billing={billing} />
		</div>
	</div>
);
