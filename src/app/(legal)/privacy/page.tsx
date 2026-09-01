import type { Metadata } from "next";
import { LegalPage } from "@/modules/marketing/components/LegalPage";

export const metadata: Metadata = {
	description: "CashLift privacy placeholder.",
	title: "Privacy — CashLift",
};

export default function Privacy() {
	return <LegalPage />;
}
