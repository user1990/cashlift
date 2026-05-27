import type { Metadata } from "next";
import { CustomersPage } from "@/modules/marketing/components/CustomersPage";

export const metadata: Metadata = {
	title: "Customers — Kuvro",
	description: "Kuvro proof stories for service firms managing spend, invoices, and vendor leaks.",
};

export default function Customers() {
	return <CustomersPage />;
}
