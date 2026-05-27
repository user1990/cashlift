import type { Metadata } from "next";
import { UseCasePage } from "@/modules/marketing/components/UseCasePage";
import { USE_CASES } from "@/modules/marketing/content";

export const metadata: Metadata = {
	title: "Consulting — Kuvro",
	description: "Cash-aware approvals for consulting firms and retainer teams.",
};

export default function Consulting() {
	return <UseCasePage useCase={USE_CASES.consulting} />;
}
