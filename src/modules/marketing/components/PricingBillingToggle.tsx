"use client";

import { useRouter } from "next/navigation";
import { startTransition, useOptimistic } from "react";
import { RadioGroup } from "react-aria-components";
import { cn } from "@/ui/utils/cn";
import type { PricingBilling } from "../content";
import { PricingBillingOption } from "./PricingBillingOption";

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
			<RadioGroup
				aria-label="Billing interval"
				onChange={(nextBilling) => {
					if (nextBilling === "annual" || nextBilling === "monthly") {
						selectBilling(nextBilling);
					}
				}}
				orientation="horizontal"
				value={selectedBilling}
				className="relative isolate mx-auto grid h-10 w-full max-w-64 grid-cols-2 rounded-full border border-border-strong bg-shell-band p-1 shadow-shell"
			>
				<span
					aria-hidden
					className={cn(
						"pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-primary shadow-primary-glow transition-transform duration-[var(--motion-duration-standard)] ease-in-out motion-reduce:transition-none",
						selectedBilling === "monthly" && "translate-x-full",
					)}
				/>

				<PricingBillingOption value="annual">Yearly</PricingBillingOption>

				<PricingBillingOption value="monthly">Monthly</PricingBillingOption>
			</RadioGroup>

			<p className="text-center text-s text-shell-muted">
				{selectedBilling === "annual" ? "Billed annually. Cancel anytime." : "Billed monthly. Cancel anytime."}
			</p>
		</div>
	);
};
