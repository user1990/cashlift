import type { MoneyCents } from "@/modules/money/types";

export type InvoiceStatus = "sent" | "overdue" | "promised" | "paid";

export type Invoice = {
	amountCents: MoneyCents;
	client: string;
	collectionProbability: number;
	dueDate: string;
	id: string;
	owner: string;
	status: InvoiceStatus;
};
