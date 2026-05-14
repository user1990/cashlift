import type { Metadata } from "next";
import { ContactPage } from "@/modules/features/marketing/components/ContactPage";

export const metadata: Metadata = {
	title: "Contact — CashLift",
	description: "Contact CashLift sales or support for a cash ops walkthrough.",
};

export default function Contact() {
	return <ContactPage />;
}
