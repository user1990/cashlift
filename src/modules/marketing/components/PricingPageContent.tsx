"use client";

import { useEffect, useState } from "react";
import type { PricingBilling } from "../content";
import { PricingComparisonSection } from "./PricingComparisonSection";
import { PricingHeroSection } from "./PricingHeroSection";
import { PricingPlansSection } from "./PricingPlansSection";
import { PricingTrustNotes } from "./PricingTrustNotes";

type PricingPageContentProps = {
	initialBilling: PricingBilling;
};

export const PricingPageContent = ({ initialBilling }: PricingPageContentProps) => {
	const [billing, setBilling] = useState<PricingBilling>(initialBilling);

	useEffect(() => {
		setBilling(initialBilling);
	}, [initialBilling]);

	const changeBilling = (value: PricingBilling) => {
		const params = new URLSearchParams(window.location.search);
		params.set("billing", value);
		window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
		setBilling(value);
	};

	return (
		<>
			<section className="min-w-0" aria-labelledby="pricing-heading">
				<PricingHeroSection billing={billing} onBillingChange={changeBilling} />

				<PricingPlansSection billing={billing} />

				<PricingTrustNotes />
			</section>

			<PricingComparisonSection />
		</>
	);
};
