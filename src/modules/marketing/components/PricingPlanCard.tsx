import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Panel } from "@/ui/components/Panel";
import { cn } from "@/ui/utils/cn";
import type { PRICING_PLANS } from "../content";

type PricingPlan = (typeof PRICING_PLANS)[number];

type PricingPlanCardProps = {
	plan: PricingPlan;
};

export const PricingPlanCard = ({ plan }: PricingPlanCardProps) => {
	const highlighted = "highlighted" in plan && plan.highlighted;

	return (
		<li className="flex">
			<Panel as="article" variant="glass" className={getPlanClassName(highlighted)}>
				<div className="flex items-start justify-between gap-4">
					<div>
						<h2 className="text-4xl+ tracking-normal text-shell-foreground">{plan.name}</h2>

						<p className="mt-3 text-m font-medium leading-6 text-shell-muted">{plan.description}</p>
					</div>

					{highlighted && (
						<span className="shrink-0 rounded-full border border-highlight/40 bg-highlight/15 px-2.5 py-1 text-2xs+ uppercase tracking-normal text-highlight">
							Popular
						</span>
					)}
				</div>

				<div className="my-6 border-t border-shell-border" />

				<p className="font-mono text-6xl+ tracking-normal text-shell-foreground">
					{plan.price}

					<span className="ml-2 font-sans text-l font-medium text-shell-muted">/mo</span>
				</p>

				<div className="my-6 border-t border-shell-border" />

				<ul className="flex flex-1 flex-col gap-4">
					{plan.features.map((feature) => (
						<li key={feature} className="flex items-start gap-3">
							<CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />

							<p className="text-m font-medium leading-6 text-shell-muted">{feature}</p>
						</li>
					))}
				</ul>

				<Link href="/signup" className={getPlanLinkClassName(highlighted)}>
					Start free trial
				</Link>
			</Panel>
		</li>
	);
};

const getPlanClassName = (highlighted: boolean | undefined) =>
	cn(
		"flex w-full flex-col overflow-hidden bg-linear-to-br from-shell-elevated via-shell to-shell-band p-6 shadow-shell",
		highlighted &&
			"border-primary bg-linear-to-br from-primary/25 via-shell-elevated to-highlight/15 shadow-primary-glow",
	);

const getPlanLinkClassName = (highlighted: boolean | undefined) =>
	cn(
		"mt-8 inline-flex items-center justify-center rounded-md border px-4 py-3 text-m+ transition-[background-color,border-color,box-shadow,color] duration-150 ease",
		highlighted
			? "border-primary bg-primary text-primary-foreground hover:bg-primary-hover hover:shadow-primary-glow"
			: "border-shell-border bg-white/10 text-shell-foreground hover:border-primary-subtle-border hover:bg-primary/15 hover:text-primary",
	);
