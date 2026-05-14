import type { Metadata } from "next";
import { PricingPage } from "@/modules/features/marketing/components/PricingPage";

export const metadata: Metadata = {
	title: "Pricing — CashLift",
	description: "Flat team pricing for cash-aware approvals, vendor leak detection, and daily company cash decisions.",
};

export default function Pricing() {
	return <PricingPage />;
}
