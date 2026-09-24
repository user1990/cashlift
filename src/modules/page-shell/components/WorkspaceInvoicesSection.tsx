"use client";

import { InvoicesCockpit } from "@/modules/dashboard/cockpits/InvoicesCockpit";
import { useDashboardStatusDate } from "@/modules/dashboard/hooks/useDashboardStatusDate";
import type { FinancialDataset } from "@/modules/workspace/types";
import { useInvoiceRiskTotal } from "../hooks/useInvoiceRiskTotal";

type WorkspaceInvoicesSectionProps = {
	dataset: FinancialDataset;
	basePath?: string;
};

export const WorkspaceInvoicesSection = ({ basePath = "/dashboard", dataset }: WorkspaceInvoicesSectionProps) => {
	const asOf = useDashboardStatusDate(dataset);
	const invoiceRiskTotal = useInvoiceRiskTotal(dataset.invoices, dataset);

	return <InvoicesCockpit asOf={asOf} basePath={basePath} dataset={dataset} invoiceRiskTotal={invoiceRiskTotal} />;
};
