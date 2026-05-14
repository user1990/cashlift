import type { Metadata } from "next";
import { LegalPage } from "@/modules/features/marketing/components/LegalPage";

export const metadata: Metadata = {
	title: "Privacy — CashLift",
	description: "CashLift privacy placeholder.",
};

export default function Privacy() {
	return <LegalPage title="Privacy" />;
}
