import { PRICING_PLANS, type PricingBilling } from "../content";
import { PricingPlanCard } from "./PricingPlanCard";

type PricingPlansSectionProps = {
	billing: PricingBilling;
};

export const PricingPlansSection = ({ billing }: PricingPlansSectionProps) => (
	<ul className="mt-10 grid auto-rows-fr items-stretch gap-4 lg:grid-cols-3">
		{PRICING_PLANS.map((plan) => (
			<PricingPlanCard billing={billing} key={plan.name} plan={plan} />
		))}
	</ul>
);
