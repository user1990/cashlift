import type { Metadata } from "next";
import { UseCasePage } from "@/modules/features/marketing/components/UseCasePage";
import { USE_CASES } from "@/modules/features/marketing/content";

export const metadata: Metadata = {
	title: "Agencies — CashLift",
	description: "Cash-aware spend approvals and leak detection for agencies.",
};

export default function Agencies() {
	return <UseCasePage useCase={USE_CASES.agencies} />;
}
