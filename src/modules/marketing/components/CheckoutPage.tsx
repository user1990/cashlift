import { getPricingPlanBySlug, type PricingBilling } from "../content";
import { CheckoutHeader } from "./CheckoutHeader";
import { CheckoutPlanSummary } from "./CheckoutPlanSummary";
import { CheckoutTrialTimeline } from "./CheckoutTrialTimeline";

type CheckoutPageProps = {
	billing?: PricingBilling;
	planSlug?: string;
};

const TRIAL_DAYS = 14;
const TRIAL_END_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
	day: "numeric",
	month: "short",
	year: "numeric",
});

export const CheckoutPage = ({ billing = "monthly", planSlug }: CheckoutPageProps) => {
	const plan = getPricingPlanBySlug(planSlug);
	const price = billing === "annual" ? plan.annualPrice : plan.price;
	const billingDescription = billing === "annual" ? `${plan.annualTotal} billed annually` : "Billed monthly";
	const trialEndDate = getTrialEndDate();
	const trialEndLabel = formatTrialEndDate(trialEndDate);

	return (
		<main className="min-h-screen bg-shell text-shell-foreground">
			<CheckoutHeader billing={billing} />

			<div className="mx-auto grid max-w-295 gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-8 lg:py-20">
				<CheckoutTrialTimeline
					planPriceLabel={billing === "annual" ? `${plan.annualTotal}/year` : `${plan.price}/month`}
				/>

				<CheckoutPlanSummary
					billing={billing}
					billingDescription={billingDescription}
					features={plan.features}
					name={plan.name}
					price={price}
					trialEndLabel={trialEndLabel}
				/>
			</div>
		</main>
	);
};

function getTrialEndDate() {
	const date = new Date();
	date.setDate(date.getDate() + TRIAL_DAYS);

	return date;
}

function formatTrialEndDate(date: Date) {
	return TRIAL_END_DATE_FORMATTER.format(date);
}
