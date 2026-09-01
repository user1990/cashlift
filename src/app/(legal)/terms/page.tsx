import type { Metadata } from "next";
import { LegalPage } from "@/modules/marketing/components/LegalPage";

export const metadata: Metadata = {
	description: "CashLift terms placeholder.",
	title: "Terms — CashLift",
};

export default function Terms() {
	return <LegalPage />;
}
