import { PRICING_PLANS } from "../content";
import { PricingPlanCard } from "./PricingPlanCard";

export const PricingPlansSection = () => (
	<ul className="mt-10 grid auto-rows-fr items-stretch gap-4 lg:grid-cols-3">
		{PRICING_PLANS.map((plan) => (
			<PricingPlanCard key={plan.name} plan={plan} />
		))}
	</ul>
);
