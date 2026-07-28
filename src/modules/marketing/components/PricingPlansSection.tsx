import { ShieldCheck, UsersRound } from "lucide-react";
import { PRICING_PLANS, type PricingBilling } from "../content";
import { Hero } from "./Hero";
import { PricingBillingToggle } from "./PricingBillingToggle";
import { PricingPlanCard } from "./PricingPlanCard";

type PricingPlansSectionProps = {
	billing: PricingBilling;
};

export const PricingPlansSection = ({ billing }: PricingPlansSectionProps) => (
	<section>
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

		<ul className="mt-10 grid auto-rows-fr items-stretch gap-4 lg:grid-cols-3">
			{PRICING_PLANS.map((plan) => {
				const { name } = plan;

				return <PricingPlanCard key={name} billing={billing} plan={plan} />;
			})}
		</ul>

		<div className="mt-8 grid gap-4 border-b border-shell-border pb-6 text-m text-shell-muted sm:grid-cols-2">
			<p className="flex items-center gap-3 sm:justify-end sm:border-r sm:border-shell-border sm:pr-8">
				<UsersRound aria-hidden className="size-6 shrink-0 text-primary" />
				Flat team pricing keeps request-only employees from adding seat anxiety.
			</p>

			<p className="flex items-center gap-3 sm:pl-4">
				<ShieldCheck aria-hidden className="size-6 shrink-0 text-signal" />
				Start with a free cash leak audit before choosing a paid plan.
			</p>
		</div>
	</section>
);
