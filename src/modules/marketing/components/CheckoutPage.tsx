import { getPricingPlanBySlug } from "../content";
import { CheckoutHeader } from "./CheckoutHeader";
import { CheckoutPlanSummary } from "./CheckoutPlanSummary";
import { CheckoutTrialTimeline } from "./CheckoutTrialTimeline";

type CheckoutPageProps = {
	planSlug?: string;
};

const TRIAL_DAYS = 14;
const TRIAL_END_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
	day: "numeric",
	month: "short",
	year: "numeric",
});

export const CheckoutPage = ({ planSlug }: CheckoutPageProps) => {
	const plan = getPricingPlanBySlug(planSlug);
	const trialEndDate = getTrialEndDate();
	const trialEndLabel = formatTrialEndDate(trialEndDate);

	return (
		<main className="min-h-screen bg-shell text-shell-foreground">
			<CheckoutHeader />

			<div className="mx-auto grid max-w-[1180px] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-8 lg:py-20">
				<CheckoutTrialTimeline planPrice={plan.price} />

				<CheckoutPlanSummary
					features={plan.features}
					name={plan.name}
					price={plan.price}
					trialEndLabel={trialEndLabel}
				/>
			</div>
		</main>
	);
};

const getTrialEndDate = () => {
	const date = new Date();
	date.setDate(date.getDate() + TRIAL_DAYS);

	return date;
};

const formatTrialEndDate = (date: Date) => TRIAL_END_DATE_FORMATTER.format(date);
