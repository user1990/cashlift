import { CheckCircle2, Star } from "lucide-react";
import Link from "next/link";
import { Panel } from "@/ui/components/Panel";
import { cn } from "@/ui/utils/cn";
import type { PRICING_PLANS, PricingBilling } from "../content";

type PricingPlan = (typeof PRICING_PLANS)[number];

type PricingPlanCardProps = {
	billing: PricingBilling;
	plan: PricingPlan;
};

export const PricingPlanCard = ({ billing, plan }: PricingPlanCardProps) => {
	const highlighted = "highlighted" in plan && plan.highlighted;
	const price = billing === "annual" ? plan.annualPrice : plan.price;

	return (
		<li className="relative flex pt-3">
			{highlighted && (
				<span className="absolute left-1/2 top-0 z-10 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-s font-semibold text-primary-foreground shadow-primary-glow">
					<Star aria-hidden className="size-3.5 fill-current" />
					Recommended
				</span>
			)}

			<Panel as="article" variant="glass" className={getPlanClassName(highlighted)}>
				<header>
					<div className="flex items-start justify-between gap-3">
						<h2 className="text-4xl+ tracking-normal text-shell-foreground">{plan.name}</h2>

						{billing === "annual" && (
							<span className="shrink-0 rounded-sm bg-signal-subtle px-2 py-1 text-s font-semibold text-signal">
								Save 20%
							</span>
						)}
					</div>

					<p className="mt-3 min-h-12 text-l font-medium leading-6 text-shell-muted">{plan.description}</p>
				</header>

				<div className="my-5 border-t border-shell-border" />

				<p className="flex items-end gap-2 text-shell-foreground">
					<span className="font-mono text-6xl+ leading-none tracking-normal">{price}</span>

					<span className="pb-1 text-m font-medium text-shell-muted">/mo</span>
				</p>

				<p className="mt-3 min-h-5 text-s text-shell-muted">
					{billing === "annual" ? `${plan.annualTotal} billed annually` : "Billed monthly"}
				</p>

				<div className="my-5 border-t border-shell-border" />

				<ul className="flex flex-1 flex-col gap-3.5">
					{plan.features.map((feature) => (
						<li key={feature} className="flex items-start gap-3">
							<CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />

							<p className="text-m leading-6 text-shell-foreground">{feature}</p>
						</li>
					))}
				</ul>

				<Link href={`/checkout?plan=${plan.slug}&billing=${billing}`} className={getPlanLinkClassName(highlighted)}>
					Start with {plan.name}
				</Link>
			</Panel>
		</li>
	);
};

function getPlanClassName(highlighted?: boolean) {
	return cn(
		"flex w-full flex-col overflow-hidden bg-shell-elevated/65 p-6 shadow-none lg:min-h-[34rem]",
		highlighted && "border-primary bg-linear-to-br from-primary/15 via-shell-elevated to-shell shadow-primary-glow",
	);
}

function getPlanLinkClassName(highlighted?: boolean) {
	return cn(
		"mt-7 inline-flex min-h-11 items-center justify-center rounded-md border px-4 text-m+ outline-none transition-[background-color,border-color,box-shadow,color] duration-150 ease focus-visible:ring-[3px] focus-visible:ring-primary/20",
		highlighted
			? "border-primary bg-primary text-primary-foreground shadow-primary-glow hover:bg-primary-hover"
			: "border-shell-border text-shell-foreground hover:border-primary hover:text-primary",
	);
}
