import type { Metadata } from "next";
import { UseCasePage } from "@/modules/marketing/components/UseCasePage";
import { USE_CASES } from "@/modules/marketing/content";

export const metadata: Metadata = {
	title: "Agencies — Kuvro",
	description: "Cash-aware spend approvals and leak detection for agencies.",
};

export default function Agencies() {
	return <UseCasePage useCase={USE_CASES.agencies} />;
}
