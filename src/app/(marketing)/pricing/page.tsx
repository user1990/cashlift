import type { Metadata } from "next";
import { Suspense } from "react";
import { PricingPage } from "@/modules/marketing/components/PricingPage";

type PricingRouteProps = {
	searchParams: Promise<{
		billing?: string;
	}>;
};

export const metadata: Metadata = {
	title: "Pricing — CashLift",
	description: "Flat team pricing for cash-aware approvals, vendor leak detection, and daily company cash decisions.",
};

export default function Pricing({ searchParams }: PricingRouteProps) {
	return (
		<Suspense fallback={<PricingPage />}>
			<PricingWithBilling searchParams={searchParams} />
		</Suspense>
	);
}

const PricingWithBilling = async ({ searchParams }: PricingRouteProps) => {
	const { billing } = await searchParams;

	return <PricingPage initialBilling={billing === "monthly" ? "monthly" : "annual"} />;
};
