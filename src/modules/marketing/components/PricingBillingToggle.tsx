import Link from "next/link";
import { cn } from "@/ui/utils/cn";
import type { PricingBilling } from "../content";

type PricingBillingToggleProps = {
	billing: PricingBilling;
};

export const PricingBillingToggle = ({ billing }: PricingBillingToggleProps) => (
	<div className="space-y-3">
		<nav aria-label="Billing interval" className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
			<BillingLink billing={billing} value="monthly">
				Monthly
			</BillingLink>

			<BillingSwitch billing={billing} />

			<BillingLink billing={billing} value="annual">
				Yearly
			</BillingLink>

			<span className="rounded-full border border-signal/40 bg-signal-subtle px-3 py-1.5 text-m font-semibold text-signal">
				Save 20%
			</span>
		</nav>

		<p className="text-center text-s text-shell-muted">
			{billing === "annual" ? "Billed annually. Cancel anytime." : "Billed monthly. Cancel anytime."}
		</p>
	</div>
);

type BillingLinkProps = {
	billing: PricingBilling;
	children: string;
	value: PricingBilling;
};

const BillingLink = ({ billing, children, value }: BillingLinkProps) => (
	<Link
		aria-current={billing === value ? "page" : undefined}
		className="min-h-11 px-1 text-xl font-semibold text-shell-muted outline-none transition-colors duration-150 hover:text-shell-foreground focus-visible:ring-[3px] focus-visible:ring-primary/20 aria-[current=page]:text-shell-foreground sm:text-2xl"
		href={`/pricing?billing=${value}`}
		scroll={false}
	>
		{children}
	</Link>
);

const BillingSwitch = ({ billing }: { billing: PricingBilling }) => {
	const nextBilling = billing === "monthly" ? "annual" : "monthly";

	return (
		<Link
			aria-label={`Switch to ${nextBilling === "annual" ? "yearly" : "monthly"} billing`}
			className="relative flex size-12 shrink-0 items-center rounded-full border border-primary/60 bg-primary/15 p-1 outline-none transition-[background-color,border-color,box-shadow] duration-150 hover:border-primary hover:bg-primary/25 focus-visible:ring-[3px] focus-visible:ring-primary/20"
			href={`/pricing?billing=${nextBilling}`}
			scroll={false}
		>
			<span
				aria-hidden
				className={cn(
					"size-8 rounded-full bg-linear-to-r from-primary via-highlight to-primary-hover shadow-primary-glow transition-transform duration-150",
					billing === "annual" && "translate-x-3",
				)}
			/>
		</Link>
	);
};
