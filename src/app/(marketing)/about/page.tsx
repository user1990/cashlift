import type { Metadata } from "next";
import { AboutPage } from "@/modules/marketing/components/AboutPage";

export const metadata: Metadata = {
	description:
		"Learn what CashLift does, who it is for, and how its read-only demo keeps financial decisions explainable.",
	title: "About CashLift",
};

export default function About() {
	return <AboutPage />;
}
