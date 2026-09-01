import type { Metadata } from "next";
import { DeveloperResourcesPage } from "@/modules/marketing/components/DeveloperResourcesPage";

export const metadata: Metadata = {
	title: "Developers — CashLift",
	description: "CashLift API documentation, authentication guidance, OpenAPI specification, and agent resources.",
};

export default function Developers() {
	return <DeveloperResourcesPage />;
}
