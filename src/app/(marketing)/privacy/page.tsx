import type { Metadata } from "next";
import { LegalPage } from "@/modules/marketing/components/LegalPage";

export const metadata: Metadata = {
	title: "Privacy — Kuvro",
	description: "Kuvro privacy placeholder.",
};

export default function Privacy() {
	return <LegalPage title="Privacy" />;
}
