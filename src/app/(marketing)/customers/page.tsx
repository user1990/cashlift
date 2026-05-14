import type { Metadata } from "next";
import { CustomersPage } from "@/modules/features/marketing/components/CustomersPage";

export const metadata: Metadata = {
	title: "Customers — CashLift",
	description: "CashLift proof stories for service firms managing spend, invoices, and vendor leaks.",
};

export default function Customers() {
	return <CustomersPage />;
}
