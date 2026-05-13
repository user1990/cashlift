import type { Metadata } from "next";
import { DemoPage } from "@/modules/features/marketing/components/DemoPage";

export const metadata: Metadata = {
	title: "Demo — CashLift",
	description: "Run a CashLift cash leak audit demo for service firms and daily cash ops workflows.",
};

export default function Demo() {
	return <DemoPage />;
}
