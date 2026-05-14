import type { Metadata } from "next";
import { UseCasePage } from "@/modules/features/marketing/components/UseCasePage";
import { USE_CASES } from "@/modules/features/marketing/content";

export const metadata: Metadata = {
	title: "Software Services — CashLift",
	description: "Cash-aware approvals for software service teams managing payroll, cloud costs, and client milestones.",
};

export default function SoftwareServices() {
	return <UseCasePage useCase={USE_CASES["software-services"]} />;
}
