import type { Metadata } from "next";
import { CheckoutPage } from "@/modules/marketing/components/CheckoutPage";

type CheckoutRouteProps = {
	searchParams: Promise<{
		billing?: string;
		plan?: string;
	}>;
};

export const metadata: Metadata = {
	title: "Checkout — CashLift",
	description: "Review your CashLift trial before continuing to secure checkout.",
};

export const instant = false;

export default async function Checkout({ searchParams }: CheckoutRouteProps) {
	const { billing, plan } = await searchParams;

	return <CheckoutPage billing={billing === "annual" ? "annual" : "monthly"} planSlug={plan} />;
}
