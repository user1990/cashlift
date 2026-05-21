import { MainContent } from "@/modules/page-shell/components/MainContent";
import { PRICING_PLANS } from "../content";
import { Hero } from "./Hero";
import { PricingPlanCard } from "./PricingPlanCard";

export const PricingPage = () => (
	<MainContent variant="marketing">
		<Hero
			description="Start with a free cash leak audit, then use one plan for owners, finance, managers, and request-only employees."
			label="Pricing"
			title="Flat team plans. Invite every employee without seat anxiety."
		/>

		<ul className="mt-10 grid auto-rows-fr items-stretch gap-4 lg:grid-cols-3">
			{PRICING_PLANS.map((plan) => (
				<PricingPlanCard key={plan.name} plan={plan} />
			))}
		</ul>
	</MainContent>
);
