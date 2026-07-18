import type { PricingBilling } from "../content";

type PricingBillingToggleProps = {
	billing: PricingBilling;
	onChange: (billing: PricingBilling) => void;
};

export const PricingBillingToggle = ({ billing, onChange }: PricingBillingToggleProps) => (
	<div>
		<fieldset className="flex items-center gap-3">
			<legend className="sr-only">Billing interval</legend>

			{(["monthly", "annual"] as const).map((value) => (
				<button
					aria-pressed={billing === value}
					className="min-h-11 cursor-pointer rounded-full border border-shell-border px-5 text-m font-medium capitalize text-shell-muted outline-none transition-[background-color,border-color,color,box-shadow] duration-150 hover:border-primary-subtle-border hover:text-shell-foreground focus-visible:ring-[3px] focus-visible:ring-primary/20 aria-pressed:border-primary aria-pressed:bg-primary/10 aria-pressed:text-shell-foreground"
					key={value}
					onClick={() => onChange(value)}
					type="button"
				>
					{value}
				</button>
			))}

			<span className="rounded-md border border-signal/40 bg-signal-subtle px-2 py-1 text-s text-signal">Save 20%</span>
		</fieldset>

		<p className="mt-3 text-center text-s text-shell-muted">
			{billing === "annual" ? "Billed annually. Cancel anytime." : "Billed monthly. Cancel anytime."}
		</p>
	</div>
);
