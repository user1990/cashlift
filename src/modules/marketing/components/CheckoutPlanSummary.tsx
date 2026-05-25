import { CheckCircle2, CreditCard } from "lucide-react";
import Link from "next/link";
import { Panel } from "@/ui/components/Panel";
import { CheckoutActionButton } from "./CheckoutActionButton";

type CheckoutPlanSummaryProps = {
	features: readonly string[];
	name: string;
	price: string;
	trialEndLabel: string;
};

export const CheckoutPlanSummary = ({ features, name, price, trialEndLabel }: CheckoutPlanSummaryProps) => (
	<Panel
		as="section"
		variant="glass"
		className="border-primary-subtle-border/70 bg-shell-elevated/90 p-6 shadow-primary-glow lg:sticky lg:top-8 lg:self-start"
	>
		<p className="inline-flex rounded-full border border-primary-subtle-border bg-primary-subtle px-3 py-1 text-s+ font-medium text-primary">
			Selected plan
		</p>

		<h2 className="mt-6 text-4xl+ tracking-normal text-shell-foreground">{name}</h2>

		<p className="mt-3 font-mono text-6xl+ tracking-normal text-shell-foreground">
			{price}
			<span className="ml-2 font-sans text-l font-medium text-shell-muted">/mo</span>
		</p>

		<p className="mt-8 text-m+ font-medium text-shell-muted">Includes:</p>

		<ul className="mt-4 space-y-4">
			{features.map((feature) => (
				<li key={feature} className="flex items-start gap-3">
					<CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />

					<span className="text-m leading-6 text-shell-foreground">{feature}</span>
				</li>
			))}
		</ul>

		<div className="my-8 border-t border-shell-border" />

		<dl className="space-y-4">
			<div className="flex justify-between gap-4">
				<dt className="text-m text-shell-muted">Due today</dt>

				<dd className="font-mono text-xl text-signal">$0</dd>
			</div>

			<div className="flex justify-between gap-4">
				<dt className="text-m text-shell-muted">Trial ends</dt>

				<dd className="text-right text-m+ text-shell-foreground">{trialEndLabel}</dd>
			</div>
		</dl>

		<CheckoutActionButton planName={name} />

		<Link
			href="/pricing"
			className="mt-5 block text-center text-m font-medium text-shell-muted transition-colors duration-150 hover:text-primary"
		>
			Change plan
		</Link>

		<div className="mt-8 border-t border-shell-border pt-6">
			<p className="flex items-center justify-center gap-2 text-m text-shell-muted">
				<CreditCard aria-hidden className="size-5" />
				Payments by Stripe
			</p>
		</div>
	</Panel>
);
