import type { Metadata } from "next";
import { DemoPage } from "@/modules/marketing/components/DemoPage";
import { DEMO_PAGE } from "@/modules/marketing/site";

export const metadata: Metadata = {
	title: "Demo — CashLift",
	description: DEMO_PAGE.metadataDescription,
};

export default function Demo() {
	return <DemoPage />;
}
