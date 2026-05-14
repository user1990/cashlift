import type { Metadata } from "next";
import { UseCasePage } from "@/modules/features/marketing/components/UseCasePage";
import { USE_CASES } from "@/modules/features/marketing/content";

export const metadata: Metadata = {
	title: "Consulting — CashLift",
	description: "Cash-aware approvals for consulting firms and retainer teams.",
};

export default function Consulting() {
	return <UseCasePage useCase={USE_CASES.consulting} />;
}
