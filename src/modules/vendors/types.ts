import type { MoneyCents } from "@/modules/money/types";

export type VendorBillStatus = "scheduled" | "needs-review" | "approved";

export type VendorBill = {
	amountCents: MoneyCents;
	category: "software" | "contractor" | "operations" | "tax" | "payroll";
	dueDate: string;
	essential: boolean;
	id: string;
	status: VendorBillStatus;
	vendor: string;
};
