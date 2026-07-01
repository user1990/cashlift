import type { Metadata } from "next";
import { CheckoutPage } from "@/modules/marketing/components/CheckoutPage";

type CheckoutRouteProps = {
	searchParams: Promise<{
		plan?: string;
	}>;
};

export const metadata: Metadata = {
	title: "Checkout — CashLift",
	description: "Review your CashLift trial before continuing to secure checkout.",
};

export const instant = false;

export default async function Checkout({ searchParams }: CheckoutRouteProps) {
	const { plan } = await searchParams;

	return <CheckoutPage planSlug={plan} />;
}
