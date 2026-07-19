import Link from "next/link";
import type { PricingBilling } from "../content";

type PricingBillingToggleProps = {
	billing: PricingBilling;
};

export const PricingBillingToggle = ({ billing }: PricingBillingToggleProps) => (
	<div className="space-y-3">
		<nav
			aria-label="Billing interval"
			className="mx-auto grid w-full max-w-72 grid-cols-2 rounded-full border border-border-strong bg-shell-band p-1 shadow-shell"
		>
			<BillingLink billing={billing} value="annual">
				Yearly
			</BillingLink>

			<BillingLink billing={billing} value="monthly">
				Monthly
			</BillingLink>
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
		className="inline-flex min-h-10 items-center justify-center rounded-full px-5 text-m font-semibold text-shell-muted outline-none transition-[background-color,color,box-shadow] duration-150 hover:text-shell-foreground focus-visible:ring-[3px] focus-visible:ring-primary/25 aria-[current=page]:bg-primary/20 aria-[current=page]:text-shell-foreground aria-[current=page]:shadow-primary-glow aria-[current=page]:ring-1 aria-[current=page]:ring-primary/60"
		href={`/pricing?billing=${value}`}
		scroll={false}
	>
		{children}
	</Link>
);
