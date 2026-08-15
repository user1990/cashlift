import type { Metadata } from "next";
import { ConsultingReferencePage } from "@/modules/marketing/components/ConsultingReferencePage";
import { USE_CASES } from "@/modules/marketing/content";

export const metadata: Metadata = {
	title: "Consulting — CashLift",
	description: "Cash-aware approvals for consulting firms and retainer teams.",
};

export default function Consulting() {
	return <ConsultingReferencePage useCase={USE_CASES.consulting} />;
}
