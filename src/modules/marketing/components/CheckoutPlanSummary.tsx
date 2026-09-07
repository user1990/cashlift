import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Panel } from "@/ui/components/layout/Panel";
import type { PricingBilling } from "../content";
import { ActionLink } from "./ActionLink";

type CheckoutPlanSummaryProps = {
	billing: PricingBilling;
	billingDescription: string;
	features: readonly string[];
	name: string;
	price: string;
	trialEndLabel: string;
};

export const CheckoutPlanSummary = ({
	billing,
	billingDescription,
	features,
	name,
	price,
	trialEndLabel,
}: CheckoutPlanSummaryProps) => (
	<Panel
		as="section"
		variant="glass"
		className="border-primary-subtle-border/70 bg-shell-elevated/90 p-6 shadow-primary-glow lg:sticky lg:top-8 lg:self-start"
	>
		<p className="inline-flex rounded-full border border-primary-subtle-border bg-primary-subtle px-3 py-1 font-medium text-primary text-s+">
			Selected plan
		</p>

		<h2 className="mt-6 text-4xl+ text-shell-foreground tracking-normal">{name}</h2>

		<p className="mt-3 font-mono text-6xl+ text-shell-foreground tracking-normal">
			{price}
			<span className="ml-2 font-medium font-sans text-l text-shell-muted">/mo</span>
		</p>

		<p className="mt-2 text-s text-shell-muted">{billingDescription}</p>

		<p className="mt-8 font-medium text-m+ text-shell-muted">Includes:</p>

		<ul className="mt-4 space-y-4">
			{features.map((feature) => (
				<li key={feature} className="flex items-start gap-3">
					<CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />

					<span className="text-m text-shell-foreground leading-6">{feature}</span>
				</li>
			))}
		</ul>

		<div className="my-8 border-shell-border border-t" />

		<dl className="space-y-4">
			<div className="flex justify-between gap-4">
				<dt className="text-m text-shell-muted">Due today</dt>

				<dd className="font-mono text-signal text-xl">$0</dd>
			</div>

			<div className="flex justify-between gap-4">
				<dt className="text-m text-shell-muted">Trial ends</dt>

				<dd className="text-right text-m+ text-shell-foreground">{trialEndLabel}</dd>
			</div>
		</dl>

		<ActionLink href="/contact" className="mt-8 w-full">
			Talk to CashLift about this plan
		</ActionLink>

		<Link
			href={`/pricing?billing=${billing}`}
			className="mt-5 block text-center font-medium text-m text-shell-muted transition-colors duration-150 hover:text-primary"
		>
			Change plan
		</Link>
	</Panel>
);
