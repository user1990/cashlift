import type { Metadata } from "next";
import { DemoPage } from "@/modules/marketing/components/DemoPage";

export const metadata: Metadata = {
	title: "Demo — Kuvro",
	description: "Run a Kuvro cash leak audit demo for service firms and daily cash ops workflows.",
};

export default function Demo() {
	return <DemoPage />;
}
