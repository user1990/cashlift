import type { Metadata } from "next";
import { HomePage } from "@/modules/features/marketing/components/HomePage";

export const metadata: Metadata = {
	title: "CashLift — Cash-aware spend decisions for service teams",
	description:
		"CashLift helps service firms approve spend, chase cash, and prevent financial leaks before money leaves.",
};

export default function Home() {
	return <HomePage />;
}
