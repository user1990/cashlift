"use client";

import { InvoicesCockpit } from "@/modules/dashboard/cockpits/InvoicesCockpit";
import type { FinancialDataset } from "@/modules/workspace/types";
import { useInvoiceRiskTotal } from "../hooks/useInvoiceRiskTotal";

type WorkspaceInvoicesSectionProps = {
	dataset: FinancialDataset;
	basePath?: string;
};

export const WorkspaceInvoicesSection = ({ basePath = "/dashboard", dataset }: WorkspaceInvoicesSectionProps) => {
	const invoiceRiskTotal = useInvoiceRiskTotal(dataset.invoices);

	return <InvoicesCockpit basePath={basePath} dataset={dataset} invoiceRiskTotal={invoiceRiskTotal} />;
};
