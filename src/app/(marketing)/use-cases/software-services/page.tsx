import type { Metadata } from "next";
import { SoftwareServicesReferencePage } from "@/modules/marketing/components/SoftwareServicesReferencePage";
import { USE_CASES } from "@/modules/marketing/content";

export const metadata: Metadata = {
	title: "Software Services — CashLift",
	description: "Cash-aware approvals for software service teams managing payroll, cloud costs, and client milestones.",
};

export default function SoftwareServices() {
	return <SoftwareServicesReferencePage useCase={USE_CASES["software-services"]} />;
}
