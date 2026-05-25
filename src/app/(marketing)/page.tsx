import type { Metadata } from "next";
import { HomePage } from "@/modules/marketing/components/HomePage";

export const metadata: Metadata = {
	title: "Kuvro — Cash-aware spend decisions for service teams",
	description: "Kuvro helps service firms approve spend, chase cash, and prevent financial leaks before money leaves.",
};

export default function Home() {
	return <HomePage />;
}
