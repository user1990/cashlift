import Link from "next/link";
import type { PricingBilling } from "../content";

type PricingBillingToggleProps = {
	billing: PricingBilling;
};

export const PricingBillingToggle = ({ billing }: PricingBillingToggleProps) => (
	<div>
		<nav aria-label="Billing interval" className="flex items-center gap-3">
			{(["monthly", "annual"] as const).map((value) => (
				<Link
					aria-current={billing === value ? "page" : undefined}
					className="min-h-11 cursor-pointer rounded-full border border-shell-border px-5 text-m font-medium capitalize text-shell-muted outline-none transition-[background-color,border-color,color,box-shadow] duration-150 hover:border-primary-subtle-border hover:text-shell-foreground focus-visible:ring-[3px] focus-visible:ring-primary/20 aria-[current=page]:border-primary aria-[current=page]:bg-primary/10 aria-[current=page]:text-shell-foreground"
					href={`/pricing?billing=${value}`}
					key={value}
					scroll={false}
				>
					{value}
				</Link>
			))}

			<span className="rounded-md border border-signal/40 bg-signal-subtle px-2 py-1 text-s text-signal">Save 20%</span>
		</nav>

		<p className="mt-3 text-center text-s text-shell-muted">
			{billing === "annual" ? "Billed annually. Cancel anytime." : "Billed monthly. Cancel anytime."}
		</p>
	</div>
);
