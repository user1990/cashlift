"use client";

import { useRouter } from "next/navigation";
import { startTransition, useOptimistic } from "react";
import type { PricingBilling } from "../content";

type PricingBillingToggleProps = {
	billing: PricingBilling;
};

export const PricingBillingToggle = ({ billing }: PricingBillingToggleProps) => {
	const router = useRouter();
	const [selectedBilling, setSelectedBilling] = useOptimistic(billing);

	const selectBilling = (nextBilling: PricingBilling) => {
		if (nextBilling === selectedBilling) {
			return;
		}

		startTransition(() => {
			setSelectedBilling(nextBilling);
			router.replace(`/pricing?billing=${nextBilling}`, { scroll: false });
		});
	};

	return (
		<div className="space-y-3">
			<fieldset className="relative isolate mx-auto grid h-10 w-full max-w-64 grid-cols-2 rounded-full border border-border-strong bg-shell-band p-1 shadow-shell">
				<legend className="sr-only">Billing interval</legend>

				<span
					aria-hidden
					className={`pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-primary shadow-primary-glow transition-transform duration-200 ease-out motion-reduce:transition-none ${selectedBilling === "monthly" ? "translate-x-full" : ""}`}
				/>

				<BillingOption billing={selectedBilling} onChange={selectBilling} value="annual">
					Yearly
				</BillingOption>

				<BillingOption billing={selectedBilling} onChange={selectBilling} value="monthly">
					Monthly
				</BillingOption>
			</fieldset>

			<p className="text-center text-s text-shell-muted">
				{selectedBilling === "annual" ? "Billed annually. Cancel anytime." : "Billed monthly. Cancel anytime."}
			</p>
		</div>
	);
};

type BillingOptionProps = {
	billing: PricingBilling;
	children: string;
	onChange: (billing: PricingBilling) => void;
	value: PricingBilling;
};

const BillingOption = ({ billing, children, onChange, value }: BillingOptionProps) => {
	const active = billing === value;

	return (
		<label className="relative z-10 min-h-8 cursor-pointer">
			<input
				checked={active}
				className="peer sr-only"
				name="pricing-billing"
				onChange={() => onChange(value)}
				onKeyDown={(event) => handleBillingKeyDown(event, billing, onChange)}
				type="radio"
				value={value}
			/>

			<span className="flex min-h-8 items-center justify-center rounded-full px-4 text-s font-semibold text-shell-muted transition-colors duration-150 hover:text-shell-foreground peer-checked:text-primary-foreground peer-focus-visible:ring-[3px] peer-focus-visible:ring-primary/25">
				{children}
			</span>
		</label>
	);
};

const handleBillingKeyDown = (
	event: React.KeyboardEvent<HTMLInputElement>,
	billing: PricingBilling,
	onChange: (billing: PricingBilling) => void,
) => {
	const nextBilling = getNextBilling(event.key, billing);

	if (!nextBilling || nextBilling === billing) {
		return;
	}

	event.preventDefault();
	onChange(nextBilling);
	event.currentTarget.closest("fieldset")?.querySelector<HTMLInputElement>(`input[value="${nextBilling}"]`)?.focus();
};

const getNextBilling = (key: string, billing: PricingBilling): PricingBilling | undefined => {
	if (key === "Home") {
		return "annual";
	}

	if (key === "End") {
		return "monthly";
	}

	if (key === "ArrowLeft" || key === "ArrowRight") {
		return billing === "annual" ? "monthly" : "annual";
	}

	return undefined;
};
