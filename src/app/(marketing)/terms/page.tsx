import type { Metadata } from "next";
import { LegalPage } from "@/modules/marketing/components/LegalPage";

export const metadata: Metadata = {
	title: "Terms — CashLift",
	description: "CashLift terms placeholder.",
};

export default function Terms() {
	return <LegalPage />;
}
