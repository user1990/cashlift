import { getPricingPlanBySlug, type PricingBilling } from "../content";
import { CheckoutHeader } from "./CheckoutHeader";
import { CheckoutPlanSummary } from "./CheckoutPlanSummary";
import { CheckoutTrialTimeline } from "./CheckoutTrialTimeline";

type CheckoutPageProps = {
	billing?: PricingBilling;
	planSlug?: string;
};

export const CheckoutPage = ({ billing = "monthly", planSlug }: CheckoutPageProps) => {
	const plan = getPricingPlanBySlug(planSlug);
	const price = billing === "annual" ? plan.annualPrice : plan.price;
	const billingDescription =
		billing === "annual"
			? `${plan.annualTotal} annually; pricing discussed with CashLift`
			: "Monthly pricing discussed with CashLift";

	return (
		<main className="min-h-screen bg-shell text-shell-foreground">
			<CheckoutHeader billing={billing} />

			<div className="mx-auto grid max-w-295 gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-8 lg:py-20">
				<CheckoutTrialTimeline />

				<CheckoutPlanSummary
					billing={billing}
					billingDescription={billingDescription}
					features={plan.features}
					name={plan.name}
					price={price}
				/>
			</div>
		</main>
	);
};
