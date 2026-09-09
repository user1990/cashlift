import { CalendarClock, MessageCircle, Sparkles } from "lucide-react";
import { cn } from "@/ui/utils/cn";

type TrialStepProps = {
	description: string;
	icon: React.ComponentType<{ "aria-hidden": true; className: string }>;
	title: string;
	active?: boolean;
};
export const CheckoutTrialTimeline = () => (
	<section>
		<h1 className="max-w-2xl text-5xl+ text-primary tracking-normal sm:text-6xl+">Discuss your CashLift plan</h1>

		<p className="mt-5 max-w-xl text-shell-muted text-xl leading-8">
			Review the selected plan and talk with CashLift about fit, pricing, and next steps.
		</p>

		<h2 className="mt-12 text-s+ text-shell-muted uppercase tracking-normal">What happens next</h2>

		<ol className="mt-6 space-y-8">
			<TrialStep
				active
				description="Share your team's needs with CashLift"
				icon={MessageCircle}
				title="Start a conversation"
			/>

			<TrialStep
				description="Review plan fit, pricing, and availability"
				icon={CalendarClock}
				title="Discuss your plan"
			/>

			<TrialStep description="Choose the right next step for your team" icon={Sparkles} title="Plan next steps" />
		</ol>
	</section>
);

function TrialStep({ active, description, icon: Icon, title }: TrialStepProps) {
	return (
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
				<h3 className="font-semibold text-m+ text-shell-foreground">{title}</h3>

				<p className="mt-1 text-m text-shell-muted leading-6">{description}</p>
			</div>
		</li>
	);
}
