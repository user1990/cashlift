"use client";

import { useSyncExternalStore } from "react";
import { getInvoiceRiskTotal } from "@/modules/invoices/utils";
import type { FinancialDataset } from "@/modules/workspace/types";
import { subscribeToBrowserMidnight } from "@/utilities/dates/subscribeToBrowserMidnight";

export const useInvoiceRiskTotal = (invoices: FinancialDataset["invoices"]) =>
	useSyncExternalStore(
		subscribeToBrowserMidnight,
		() => getInvoiceRiskTotal(invoices, new Date()),
		getServerInvoiceRiskTotal,
	);

function getServerInvoiceRiskTotal() {
	return undefined;
}
