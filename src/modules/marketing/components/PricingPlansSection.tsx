import { ShieldCheck, UsersRound } from "lucide-react";
import { PRICING_PLANS, type PricingBilling } from "../content";
import { PRICING_PAGE } from "../site";
import { Hero } from "./Hero";
import { PricingBillingToggle } from "./PricingBillingToggle";
import { PricingPlanCard } from "./PricingPlanCard";

type PricingPlansSectionProps = {
	billing: PricingBilling;
};

export const PricingPlansSection = ({ billing }: PricingPlansSectionProps) => (
	<section>
		<div>
			<Hero description={PRICING_PAGE.heroDescription} label={PRICING_PAGE.heroLabel} variant="page-title" />

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

		<div className="mt-8 grid gap-4 border-shell-border border-b pb-6 text-m text-shell-muted sm:grid-cols-2">
			<p className="flex items-center gap-3 sm:justify-end sm:border-shell-border sm:border-r sm:pr-8">
				<UsersRound aria-hidden className="size-6 shrink-0 text-primary" />
				{PRICING_PAGE.seatNote}
			</p>

			<p className="flex items-center gap-3 sm:pl-4">
				<ShieldCheck aria-hidden className="size-6 shrink-0 text-signal" />
				{PRICING_PAGE.auditNote}
			</p>
		</div>
	</section>
);
