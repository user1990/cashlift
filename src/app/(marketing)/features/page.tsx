import type { Metadata } from "next";
import { FeaturesPage } from "@/modules/marketing/components/FeaturesPage";

export const metadata: Metadata = {
	title: "Features — Kuvro",
	description:
		"Action inbox, cash impact approvals, invoice collection, vendor leak detection, and 13-week cash outlook.",
};

export default function Features() {
	return <FeaturesPage />;
}
