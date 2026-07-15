import type { Metadata } from "next";
import { HomePage } from "@/modules/marketing/components/HomePage";

export const metadata: Metadata = {
	title: "CashLift — See what to collect, approve, or cut today",
	description: "CashLift ranks the cash actions that matter now in one daily inbox for service firms.",
};

export default function Home() {
	return <HomePage />;
}
