"use client";

import { useDashboardStatusDate } from "@/modules/dashboard/hooks/useDashboardStatusDate";
import { getInvoiceRiskTotal } from "@/modules/invoices/utils";
import type { FinancialDataset } from "@/modules/workspace/types";

export const useInvoiceRiskTotal = (invoices: FinancialDataset["invoices"], dataset: FinancialDataset) => {
	const asOf = useDashboardStatusDate(dataset);

	return getInvoiceRiskTotal(invoices, asOf);
};
