import { CalendarClock, CreditCard, Sparkles } from "lucide-react";
import { cn } from "@/ui/utils/cn";

type CheckoutTrialTimelineProps = {
	planPriceLabel: string;
};

type TrialStepProps = {
	description: string;
	icon: React.ComponentType<{ "aria-hidden": true; className: string }>;
	title: string;
	active?: boolean;
};

const TRIAL_DAYS = 14;
const REMINDER_DAY = 13;

export const CheckoutTrialTimeline = ({ planPriceLabel }: CheckoutTrialTimelineProps) => (
	<section>
		<h1 className="max-w-2xl text-5xl+ tracking-normal text-primary sm:text-6xl+">Start your 14-day trial</h1>

		<p className="mt-5 max-w-xl text-xl leading-8 text-shell-muted">Card required. No charge today.</p>

		<h2 className="mt-12 text-s+ uppercase tracking-normal text-shell-muted">What happens next</h2>

		<ol className="mt-6 space-y-8">
			<TrialStep active description="Create workspace and verify payment method" icon={Sparkles} title="Today" />

			<TrialStep description="Reminder before trial ends" icon={CalendarClock} title={`Day ${REMINDER_DAY}`} />

			<TrialStep description={`Plan starts at ${planPriceLabel}`} icon={CreditCard} title={`Day ${TRIAL_DAYS}`} />
		</ol>
	</section>
);

const TrialStep = ({ active, description, icon: Icon, title }: TrialStepProps) => (
	<li className="grid grid-cols-[3rem_minmax(0,1fr)] gap-5">
		<div className="relative flex justify-center">
			<span
				className={cn(
					"flex size-12 items-center justify-center rounded-full border",
					active
						? "border-primary-subtle-border bg-primary-subtle text-primary shadow-primary-glow"
						: "border-shell-border bg-shell-elevated text-shell-muted",
				)}
			>
				<Icon aria-hidden className="size-5" />
			</span>
		</div>

		<div className="min-w-0 pt-1">
			<h3 className="text-m+ font-semibold text-shell-foreground">{title}</h3>

			<p className="mt-1 text-m leading-6 text-shell-muted">{description}</p>
		</div>
	</li>
);
