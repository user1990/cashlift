import type { PricingBilling } from "../content";
import { PricingBillingToggle } from "./PricingBillingToggle";

type PricingHeroSectionProps = {
	billing: PricingBilling;
};

export const PricingHeroSection = ({ billing }: PricingHeroSectionProps) => (
	<div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
		<header>
			<p className="text-m text-shell-muted">Pricing</p>

			<h1
				className="mt-4 max-w-[40rem] text-5xl+ leading-[1.03] tracking-normal text-shell-foreground sm:text-[3.25rem]"
				id="pricing-heading"
			>
				Choose the control level your cash decisions need.
			</h1>
		</header>

		<PricingBillingToggle billing={billing} />
	</div>
);
