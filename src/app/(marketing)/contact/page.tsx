import type { Metadata } from "next";
import { ContactPage } from "@/modules/marketing/components/ContactPage";

export const metadata: Metadata = {
	title: "Contact — Kuvro",
	description: "Contact Kuvro sales or support for a cash ops walkthrough.",
};

export default function Contact() {
	return <ContactPage />;
}
