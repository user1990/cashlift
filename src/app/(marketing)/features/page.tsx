import type { Metadata } from "next";
import { FeaturesPage } from "@/modules/features/marketing/components/FeaturesPage";

export const metadata: Metadata = {
	title: "Features — CashLift",
	description:
		"Action inbox, cash impact approvals, invoice collection, vendor leak detection, and 13-week cash outlook.",
};

export default function Features() {
	return <FeaturesPage />;
}
