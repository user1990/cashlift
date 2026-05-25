import type { Metadata } from "next";
import { CheckoutPage } from "@/modules/marketing/components/CheckoutPage";

type CheckoutRouteProps = {
	searchParams: Promise<{
		plan?: string;
	}>;
};

export const metadata: Metadata = {
	title: "Checkout — Kuvro",
	description: "Review your Kuvro trial before continuing to secure checkout.",
};

export default async function Checkout({ searchParams }: CheckoutRouteProps) {
	const { plan } = await searchParams;

	return <CheckoutPage planSlug={plan} />;
}
